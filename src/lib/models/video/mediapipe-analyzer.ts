import type { VideoAnalysisAdapter, VideoAnalysisResult } from "../types";

/**
 * MediaPipe-based video analysis for post-session processing.
 * This runs server-side by extracting frames and analyzing them.
 * For the full client-side version, see use-eye-tracking.ts hook.
 */
export class MediaPipeVideoAdapter implements VideoAnalysisAdapter {
  provider = "mediapipe" as const;

  async analyze(videoUrl: string): Promise<VideoAnalysisResult> {
    // Server-side MediaPipe analysis requires ffmpeg for frame extraction.
    // For MVP, we return a placeholder that the client-side hook data will override.
    // The real-time eye tracking data captured during recording is more accurate
    // than post-processing since it runs at 10fps on the live stream.

    console.log("MediaPipe post-session analysis for:", videoUrl);

    // TODO: Implement server-side frame extraction + analysis
    // For now, return defaults — the real-time data from use-eye-tracking.ts
    // will be used as the primary source during recording.
    return {
      eyeContactPercentage: 0,
      confidenceScore: 50,
      mannerisms: [],
      keyFrames: [],
      emotions: [],
      modelProvider: "mediapipe",
    };
  }
}
