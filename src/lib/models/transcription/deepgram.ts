import type { TranscriptionAdapter } from "../types";
import type { TranscriptionResult, FillerWord, TranscriptWord } from "@/types";

const FILLER_WORDS_SET = new Set([
  "um", "uh", "uhh", "umm", "erm", "like", "you know",
  "so", "basically", "actually", "literally", "i mean",
  "right", "well",
]);

interface DeepgramWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

interface DeepgramResponse {
  results: {
    channels: {
      alternatives: {
        transcript: string;
        confidence: number;
        words: DeepgramWord[];
      }[];
    }[];
  };
  metadata: {
    duration: number;
  };
}

export class DeepgramAdapter implements TranscriptionAdapter {
  provider = "deepgram" as const;

  async transcribe(audioUrl: string): Promise<TranscriptionResult> {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) throw new Error("DEEPGRAM_API_KEY is required");

    const response = await fetch("https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&filler_words=true&punctuate=true", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: audioUrl }),
    });

    if (!response.ok) {
      throw new Error(`Deepgram API error: ${response.status} ${response.statusText}`);
    }

    const data: DeepgramResponse = await response.json();
    const channel = data.results.channels[0];
    const alternative = channel?.alternatives[0];

    if (!alternative) {
      throw new Error("No transcription results from Deepgram");
    }

    const text = alternative.transcript;
    const dgWords = alternative.words || [];
    const durationSeconds = data.metadata?.duration || 0;

    const words: TranscriptWord[] = dgWords.map((w) => ({
      text: w.word,
      start: w.start,
      end: w.end,
      confidence: w.confidence,
      isFiller: FILLER_WORDS_SET.has(w.word.toLowerCase()),
    }));

    // Count filler words
    const fillerMap = new Map<string, { count: number; timestamps: number[] }>();
    for (const w of words) {
      if (w.isFiller) {
        const key = w.text.toLowerCase();
        const existing = fillerMap.get(key) || { count: 0, timestamps: [] };
        existing.count++;
        existing.timestamps.push(w.start);
        fillerMap.set(key, existing);
      }
    }

    const fillerWords: FillerWord[] = Array.from(fillerMap.entries()).map(([word, data]) => ({
      word,
      timestamp: data.timestamps[0],
      count: data.count,
    }));

    const wordCount = words.filter((w) => !w.isFiller).length;
    const minutes = durationSeconds / 60;
    const pacingWpm = minutes > 0 ? Math.round(wordCount / minutes) : 0;

    const avgConfidence = words.length > 0
      ? words.reduce((sum, w) => sum + w.confidence, 0) / words.length
      : 0;
    const totalFillers = fillerWords.reduce((sum, fw) => sum + fw.count, 0);
    const fillerRatio = words.length > 0 ? totalFillers / words.length : 0;
    const clarityScore = Math.round(Math.max(0, Math.min(100, avgConfidence * 100 * (1 - fillerRatio * 2))));

    return {
      transcript: text,
      words,
      fillerWords,
      pacingWpm,
      clarityScore,
      confidence: Math.round(avgConfidence * 100),
      modelProvider: "deepgram",
      durationSeconds,
    };
  }
}
