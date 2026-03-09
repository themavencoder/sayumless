"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const FILLER_WORDS = [
  "um", "uh", "uhh", "umm", "erm",
  "like", "you know", "so", "basically",
  "actually", "literally", "i mean",
  "right", "okay so", "well",
];

// Build regex that matches filler words as whole words
const FILLER_REGEX = new RegExp(
  `\\b(${FILLER_WORDS.join("|")})\\b`,
  "gi"
);

interface UseFillerDetectionReturn {
  fillerCount: number;
  fillerWords: Map<string, number>;
  lastDetectedWord: string | null;
  isSupported: boolean;
}

export function useFillerDetection(isActive: boolean): UseFillerDetectionReturn {
  const [fillerCount, setFillerCount] = useState(0);
  const [fillerWords, setFillerWords] = useState<Map<string, number>>(new Map());
  const [lastDetectedWord, setLastDetectedWord] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const fillerMapRef = useRef<Map<string, number>>(new Map());
  const totalCountRef = useRef(0);

  const processTranscript = useCallback((transcript: string) => {
    const lower = transcript.toLowerCase();
    const matches = lower.match(FILLER_REGEX);

    if (matches) {
      for (const match of matches) {
        const normalized = match.trim().toLowerCase();
        const current = fillerMapRef.current.get(normalized) || 0;
        fillerMapRef.current.set(normalized, current + 1);
        totalCountRef.current++;
        setLastDetectedWord(normalized);
      }

      setFillerCount(totalCountRef.current);
      setFillerWords(new Map(fillerMapRef.current));
    }
  }, []);

  useEffect(() => {
    if (!isActive) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      return;
    }

    // Check for Web Speech API support
    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    // Reset counters on start
    fillerMapRef.current = new Map();
    totalCountRef.current = 0;
    setFillerCount(0);
    setFillerWords(new Map());
    setLastDetectedWord(null);

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    // Track which transcripts we've already processed to avoid double-counting
    let lastFinalIndex = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      // Process only new final results
      for (let i = lastFinalIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          processTranscript(result[0].transcript);
          lastFinalIndex = i + 1;
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      // "no-speech" and "aborted" are expected during natural pauses
      if (event.error !== "no-speech" && event.error !== "aborted") {
        console.warn("Speech recognition error:", event.error);
      }
    };

    recognition.onend = () => {
      // Auto-restart if still active (browser may stop recognition)
      if (isActive && recognitionRef.current) {
        try {
          recognition.start();
        } catch {
          // May throw if already started
        }
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      // May throw if microphone is in use
      setIsSupported(false);
    }

    return () => {
      try {
        recognition.stop();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
    };
  }, [isActive, processTranscript]);

  return {
    fillerCount,
    fillerWords,
    lastDetectedWord,
    isSupported,
  };
}

// Augment window types for Web Speech API
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}
