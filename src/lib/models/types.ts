import type { ModelProvider, TranscriptionResult, VideoModelProvider } from "@/types";

/**
 * Common interface for all transcription adapters.
 */
export interface TranscriptionAdapter {
  provider: ModelProvider;
  transcribe(audioUrl: string): Promise<TranscriptionResult>;
}

/**
 * Common interface for all video analysis adapters.
 */
export interface VideoAnalysisAdapter {
  provider: VideoModelProvider;
  analyze(videoUrl: string): Promise<VideoAnalysisResult>;
}

export interface VideoAnalysisResult {
  eyeContactPercentage: number;
  confidenceScore: number;
  mannerisms: { type: string; frequency: number; timestamps: number[] }[];
  keyFrames: { timestamp: number; imageUrl: string; annotations: string[] }[];
  emotions: { timestamp: number; emotions: Record<string, number>; dominantEmotion: string }[];
  modelProvider: VideoModelProvider;
}
