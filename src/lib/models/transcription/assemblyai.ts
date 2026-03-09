import { AssemblyAI } from "assemblyai";
import type { TranscriptionAdapter } from "../types";
import type { TranscriptionResult, FillerWord, TranscriptWord } from "@/types";

const FILLER_WORDS_SET = new Set([
  "um", "uh", "uhh", "umm", "erm", "like", "you know",
  "so", "basically", "actually", "literally", "i mean",
  "right", "well",
]);

export class AssemblyAIAdapter implements TranscriptionAdapter {
  provider = "assemblyai" as const;
  private client: AssemblyAI;

  constructor() {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) throw new Error("ASSEMBLYAI_API_KEY is required");
    this.client = new AssemblyAI({ apiKey });
  }

  async transcribe(audioUrl: string): Promise<TranscriptionResult> {
    const transcript = await this.client.transcripts.transcribe({
      audio_url: audioUrl,
      speech_model: "best",
      language_detection: true,
    });

    if (transcript.status === "error") {
      throw new Error(`AssemblyAI transcription failed: ${transcript.error}`);
    }

    const text = transcript.text || "";
    const aaiWords = transcript.words || [];
    const durationSeconds = (transcript.audio_duration || 0);

    // Map words to our format
    const words: TranscriptWord[] = aaiWords.map((w) => {
      const isFiller = FILLER_WORDS_SET.has(w.text.toLowerCase());
      return {
        text: w.text,
        start: w.start / 1000, // ms to seconds
        end: w.end / 1000,
        confidence: w.confidence,
        isFiller,
      };
    });

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

    // Calculate WPM
    const wordCount = words.filter((w) => !w.isFiller).length;
    const minutes = durationSeconds / 60;
    const pacingWpm = minutes > 0 ? Math.round(wordCount / minutes) : 0;

    // Calculate clarity score (based on confidence and filler ratio)
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
      modelProvider: "assemblyai",
      durationSeconds,
    };
  }
}
