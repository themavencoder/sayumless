import type { ModelProvider } from "@/types";
import type { TranscriptionAdapter } from "../types";
import { AssemblyAIAdapter } from "./assemblyai";
import { DeepgramAdapter } from "./deepgram";
import { WhisperAdapter } from "./whisper";

/**
 * Factory: get a transcription adapter by provider name.
 */
export function getTranscriptionAdapter(provider: ModelProvider): TranscriptionAdapter {
  switch (provider) {
    case "assemblyai":
      return new AssemblyAIAdapter();
    case "deepgram":
      return new DeepgramAdapter();
    case "whisper":
      return new WhisperAdapter();
    default:
      throw new Error(`Unknown transcription provider: ${provider}`);
  }
}
