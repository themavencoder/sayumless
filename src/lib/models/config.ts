import type { ModelInfo, SubscriptionTier } from "@/types";

export const TRANSCRIPTION_MODELS: ModelInfo[] = [
  {
    id: "assemblyai",
    name: "AssemblyAI",
    type: "transcription",
    strengths: "Best filler word detection, speaker diarization",
    accuracyRating: 5,
    speedRating: 4,
    costPerMinute: 0.0065,
    minTier: "free",
  },
  {
    id: "deepgram",
    name: "Deepgram Nova-2",
    type: "transcription",
    strengths: "Fastest processing, great for real-time",
    accuracyRating: 4,
    speedRating: 5,
    costPerMinute: 0.0043,
    minTier: "regular",
  },
  {
    id: "whisper",
    name: "OpenAI Whisper",
    type: "transcription",
    strengths: "Best multilingual support, robust accuracy",
    accuracyRating: 4,
    speedRating: 3,
    costPerMinute: 0.006,
    minTier: "regular",
  },
];

export const VIDEO_MODELS: ModelInfo[] = [
  {
    id: "mediapipe",
    name: "MediaPipe",
    type: "video",
    strengths: "Client-side, no API cost, fast",
    accuracyRating: 3,
    speedRating: 5,
    costPerMinute: 0,
    minTier: "free",
  },
  {
    id: "hume",
    name: "Hume AI",
    type: "video",
    strengths: "Emotion detection, expression analysis",
    accuracyRating: 5,
    speedRating: 3,
    costPerMinute: 0.01,
    minTier: "regular",
  },
];

export const ALL_MODELS = [...TRANSCRIPTION_MODELS, ...VIDEO_MODELS];

/**
 * Get the recommended (default) model for a given type.
 */
export function getRecommendedModel(type: "transcription" | "video"): ModelInfo {
  return type === "transcription" ? TRANSCRIPTION_MODELS[0] : VIDEO_MODELS[0];
}

/**
 * Check if a user's tier can access a specific model.
 */
export function canAccessModel(modelId: string, userTier: SubscriptionTier): boolean {
  const model = ALL_MODELS.find((m) => m.id === modelId);
  if (!model) return false;

  const tierOrder: SubscriptionTier[] = ["free", "regular", "unlimited"];
  return tierOrder.indexOf(userTier) >= tierOrder.indexOf(model.minTier);
}

/**
 * Check if a user can use ensemble mode.
 */
export function canUseEnsemble(userTier: SubscriptionTier): boolean {
  return userTier === "unlimited";
}
