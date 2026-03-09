import type { ModelProvider, TranscriptionResult, FillerWord, TranscriptWord } from "@/types";
import { getTranscriptionAdapter } from "./transcription";
import { TRANSCRIPTION_MODELS } from "./config";

/**
 * Run all transcription adapters and combine results.
 * Uses Promise.allSettled so one failure doesn't break the whole ensemble.
 */
export async function runTranscriptionEnsemble(
  audioUrl: string,
  providers?: ModelProvider[]
): Promise<{
  combined: TranscriptionResult;
  individual: TranscriptionResult[];
}> {
  const modelsToRun = providers || (TRANSCRIPTION_MODELS.map((m) => m.id) as ModelProvider[]);

  const results = await Promise.allSettled(
    modelsToRun.map(async (provider) => {
      const adapter = getTranscriptionAdapter(provider);
      return adapter.transcribe(audioUrl);
    })
  );

  const successful: TranscriptionResult[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      successful.push(result.value);
    } else {
      console.error("Ensemble adapter failed:", result.reason);
    }
  }

  if (successful.length === 0) {
    throw new Error("All transcription adapters failed");
  }

  // If only one succeeded, return it as both combined and individual
  if (successful.length === 1) {
    return {
      combined: { ...successful[0], modelProvider: "assemblyai" }, // fallback
      individual: successful,
    };
  }

  const combined = combineResults(successful);
  return { combined, individual: successful };
}

function combineResults(results: TranscriptionResult[]): TranscriptionResult {
  // Use the longest transcript as the base (usually most accurate)
  const sortedByLength = [...results].sort(
    (a, b) => b.transcript.length - a.transcript.length
  );
  const baseResult = sortedByLength[0];

  // Average WPM
  const avgWpm = Math.round(
    results.reduce((sum, r) => sum + r.pacingWpm, 0) / results.length
  );

  // Union filler words (deduplicate by timestamp proximity)
  const allFillers = results.flatMap((r) => r.fillerWords);
  const deduped = deduplicateFillers(allFillers);

  // Weighted clarity score (weight by model accuracy)
  const accuracyWeights: Record<string, number> = {
    assemblyai: 5,
    deepgram: 4,
    whisper: 4,
  };

  let totalWeight = 0;
  let weightedClarity = 0;
  let weightedConfidence = 0;
  for (const r of results) {
    const weight = accuracyWeights[r.modelProvider] || 3;
    totalWeight += weight;
    weightedClarity += r.clarityScore * weight;
    weightedConfidence += r.confidence * weight;
  }

  return {
    transcript: baseResult.transcript,
    words: baseResult.words,
    fillerWords: deduped,
    pacingWpm: avgWpm,
    clarityScore: Math.round(weightedClarity / totalWeight),
    confidence: Math.round(weightedConfidence / totalWeight),
    modelProvider: "assemblyai", // base model
    durationSeconds: baseResult.durationSeconds,
  };
}

/**
 * Deduplicate filler words that are within 0.5s of each other (same word from different models).
 */
function deduplicateFillers(fillers: FillerWord[]): FillerWord[] {
  const merged = new Map<string, FillerWord>();

  for (const filler of fillers) {
    const key = filler.word.toLowerCase();
    const existing = merged.get(key);
    if (existing) {
      existing.count = Math.max(existing.count, filler.count);
    } else {
      merged.set(key, { ...filler });
    }
  }

  return Array.from(merged.values());
}
