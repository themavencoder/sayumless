import type { VideoModelProvider } from "@/types";
import type { VideoAnalysisAdapter } from "../types";
import { MediaPipeVideoAdapter } from "./mediapipe-analyzer";
import { HumeVideoAdapter } from "./hume";

export function getVideoAdapter(provider: VideoModelProvider): VideoAnalysisAdapter {
  switch (provider) {
    case "mediapipe":
      return new MediaPipeVideoAdapter();
    case "hume":
      return new HumeVideoAdapter();
    default:
      throw new Error(`Unknown video provider: ${provider}`);
  }
}
