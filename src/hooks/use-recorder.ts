"use client";

import { useState, useCallback, useRef } from "react";

interface UseRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  stream: MediaStream | null;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  pauseRecording: () => void;
  resumeRecording: () => void;
}

interface UseRecorderOptions {
  video?: boolean;
  audio?: boolean;
  mimeType?: string;
}

export function useRecorder(options: UseRecorderOptions = {}): UseRecorderReturn {
  const { video = true, audio = true, mimeType = "video/webm;codecs=vp9" } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      chunksRef.current = [];

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: video ? { facingMode: "user", width: 1280, height: 720 } : false,
        audio: audio ? { echoCancellation: true, noiseSuppression: true } : false,
      });

      setStream(mediaStream);

      const recorder = new MediaRecorder(mediaStream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : "video/webm",
        videoBitsPerSecond: 2500000, // 2.5 Mbps
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000); // Collect data every second
      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to access camera/microphone";
      setError(message);
      throw err;
    }
  }, [video, audio, mimeType]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;

      if (!recorder || recorder.state === "inactive") {
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });

        // Stop all tracks
        stream?.getTracks().forEach((track) => track.stop());
        setStream(null);
        setIsRecording(false);
        setIsPaused(false);
        mediaRecorderRef.current = null;

        resolve(blob);
      };

      recorder.stop();
    });
  }, [stream]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  return {
    isRecording,
    isPaused,
    stream,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  };
}
