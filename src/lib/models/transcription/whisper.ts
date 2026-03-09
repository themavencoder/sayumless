import OpenAI from "openai";
import type { TranscriptionAdapter } from "../types";
import type { TranscriptionResult, FillerWord, TranscriptWord } from "@/types";

const FILLER_WORDS_SET = new Set([
  "um", "uh", "uhh", "umm", "erm", "like", "you know",
  "so", "basically", "actually", "literally", "i mean",
  "right", "well",
]);

export class WhisperAdapter implements TranscriptionAdapter {
  provider = "whisper" as const;
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is required");
    this.client = new OpenAI({ apiKey });
  }

  async transcribe(audioUrl: string): Promise<TranscriptionResult> {
    // Download audio from URL to pass as file
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error(`Failed to fetch audio: ${audioResponse.statusText}`);
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    const audioFile = new File([audioBuffer], "recording.webm", {
      type: "audio/webm",
    });

    const result = await this.client.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const verboseResult = result as any;
    const text = verboseResult.text || "";
    const whisperWords = verboseResult.words || [];
    const durationSeconds = verboseResult.duration || 0;

    const words: TranscriptWord[] = whisperWords.map((w: { word: string; start: number; end: number }) => ({
      text: w.word.trim(),
      start: w.start,
      end: w.end,
      confidence: 0.9, // Whisper doesn't provide per-word confidence
      isFiller: FILLER_WORDS_SET.has(w.word.trim().toLowerCase()),
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

    const wordCount = words.filter((w: TranscriptWord) => !w.isFiller).length;
    const minutes = durationSeconds / 60;
    const pacingWpm = minutes > 0 ? Math.round(wordCount / minutes) : 0;

    const totalFillers = fillerWords.reduce((sum, fw) => sum + fw.count, 0);
    const fillerRatio = words.length > 0 ? totalFillers / words.length : 0;
    const clarityScore = Math.round(Math.max(0, Math.min(100, 90 * (1 - fillerRatio * 2))));

    return {
      transcript: text,
      words,
      fillerWords,
      pacingWpm,
      clarityScore,
      confidence: 90, // Whisper doesn't provide overall confidence
      modelProvider: "whisper",
      durationSeconds,
    };
  }
}
