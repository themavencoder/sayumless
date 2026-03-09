import type { VideoModelProvider } from "@/types";
import type { VideoAnalysisResult } from "../types";
import { getVideoAdapter } from "./index";
import { VIDEO_MODELS } from "../config";

export async function runVideoEnsemble(
  videoUrl: string,
  providers?: VideoModelProvider[]
): Promise<{
  combined: VideoAnalysisResult;
  individual: VideoAnalysisResult[];
}> {
  const modelsToRun = providers || (VIDEO_MODELS.map((m) => m.id) as VideoModelProvider[]);

  const results = await Promise.allSettled(
    modelsToRun.map(async (provider) => {
      const adapter = getVideoAdapter(provider);
      return adapter.analyze(videoUrl);
    })
  );

  const successful: VideoAnalysisResult[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      successful.push(result.value);
    } else {
      console.error("Video ensemble adapter failed:", result.reason);
    }
  }

  if (successful.length === 0) {
    throw new Error("All video analysis adapters failed");
  }

  if (successful.length === 1) {
    return { combined: successful[0], individual: successful };
  }

  const combined = combineVideoResults(successful);
  return { combined, individual: successful };
}

function combineVideoResults(results: VideoAnalysisResult[]): VideoAnalysisResult {
  // Weighted average — Hume is more accurate for emotions, MediaPipe for eye contact
  const weights: Record<string, number> = {
    mediapipe: 3,
    hume: 5,
  };

  let totalWeight = 0;
  let weightedEyeContact = 0;
  let weightedConfidence = 0;

  for (const r of results) {
    const weight = weights[r.modelProvider] || 3;
    totalWeight += weight;
    weightedEyeContact += r.eyeContactPercentage * weight;
    weightedConfidence += r.confidenceScore * weight;
  }

  // Merge emotions from all models
  const allEmotions = results.flatMap((r) => r.emotions);
  allEmotions.sort((a, b) => a.timestamp - b.timestamp);

  // Merge mannerisms
  const allMannerisms = results.flatMap((r) => r.mannerisms);

  return {
    eyeContactPercentage: Math.round(weightedEyeContact / totalWeight),
    confidenceScore: Math.round(weightedConfidence / totalWeight),
    mannerisms: allMannerisms,
    keyFrames: results.flatMap((r) => r.keyFrames),
    emotions: allEmotions,
    modelProvider: "hume", // primary in ensemble
  };
}
