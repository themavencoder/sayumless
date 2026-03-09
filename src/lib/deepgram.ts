import { DeepgramClient } from "@deepgram/sdk";

let _client: DeepgramClient | null = null;

export function getDeepgramClient(): DeepgramClient {
  if (!_client) {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) throw new Error("DEEPGRAM_API_KEY is required");
    _client = new DeepgramClient({ apiKey });
  }
  return _client;
}

const FILLER_WORDS = new Set([
  "um", "uh", "hmm", "mm", "ah", "er", "like", "you know",
  "basically", "actually", "literally", "right", "so", "well",
  "i mean", "sort of", "kind of", "okay",
]);

export interface TranscriptionResult {
  transcript: string;
  words: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
    isFiller: boolean;
  }>;
  fillerWords: Array<{
    word: string;
    timestamp: number;
    count: number;
  }>;
  pacingWpm: number;
  clarityScore: number;
  confidence: number;
  durationSeconds: number;
}

export async function transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<TranscriptionResult> {
  const client = getDeepgramClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await client.listen.v1.media.transcribeFile(audioBuffer, {
    model: "nova-3",
    punctuate: true,
    utterances: true,
    filler_words: true,
    smart_format: true,
  });

  if (!data?.results) throw new Error("No transcription result returned");

  const channel = data.results.channels[0];
  const alternative = channel.alternatives[0];
  const transcript: string = alternative.transcript || "";
  const rawWords: Array<{ word: string; punctuated_word?: string; start: number; end: number; confidence: number }> = alternative.words || [];
  const duration: number = data.metadata?.duration || 1;

  // Map words with filler detection
  const words = rawWords.map((w) => ({
    text: w.punctuated_word || w.word,
    start: w.start,
    end: w.end,
    confidence: w.confidence,
    isFiller: FILLER_WORDS.has(w.word.toLowerCase()),
  }));

  // Aggregate filler words
  const fillerMap = new Map<string, { count: number; firstTimestamp: number }>();
  for (const w of words) {
    if (w.isFiller) {
      const key = w.text.toLowerCase();
      const existing = fillerMap.get(key);
      if (existing) {
        existing.count++;
      } else {
        fillerMap.set(key, { count: 1, firstTimestamp: w.start });
      }
    }
  }

  const fillerWords = Array.from(fillerMap.entries()).map(([word, data]) => ({
    word,
    timestamp: data.firstTimestamp,
    count: data.count,
  }));

  // Calculate WPM (exclude filler words from count)
  const meaningfulWords = words.filter((w) => !w.isFiller);
  const durationMinutes = duration / 60;
  const pacingWpm = durationMinutes > 0 ? Math.round(meaningfulWords.length / durationMinutes) : 0;

  // Clarity score: penalize for fillers relative to total words
  const totalFillers = fillerWords.reduce((sum, fw) => sum + fw.count, 0);
  const fillerRatio = words.length > 0 ? totalFillers / words.length : 0;
  const clarityScore = Math.round(Math.max(0, (1 - fillerRatio * 3)) * 100);

  // Average confidence
  const avgConfidence =
    words.length > 0
      ? Math.round((words.reduce((sum, w) => sum + w.confidence, 0) / words.length) * 100)
      : 0;

  return {
    transcript,
    words,
    fillerWords,
    pacingWpm,
    clarityScore,
    confidence: avgConfidence,
    durationSeconds: duration,
  };
}
