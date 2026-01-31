// Session types
export interface Session {
  id: string;
  userId: string;
  topic: string;
  durationSeconds: number;
  status: SessionStatus;
  createdAt: Date;
}

export type SessionStatus = "pending" | "recording" | "processing" | "complete" | "failed";

// Recording types
export interface Recording {
  id: string;
  sessionId: string;
  type: "audio" | "video";
  storageUrl: string;
  sizeBytes: number;
}

// Analysis types
export interface AudioAnalysis {
  id: string;
  sessionId: string;
  transcription: string;
  fillerWords: FillerWord[];
  pacingWpm: number;
  clarityScore: number;
}

export interface FillerWord {
  word: string;
  timestamp: number;
  count: number;
}

export interface VideoAnalysis {
  id: string;
  sessionId: string;
  eyeContactPercentage: number;
  confidenceScore: number;
  mannerisms: Mannerism[];
  keyFrames: KeyFrame[];
}

export interface Mannerism {
  type: string;
  frequency: number;
  timestamps: number[];
}

export interface KeyFrame {
  timestamp: number;
  imageUrl: string;
  annotations: string[];
}

// Feedback types
export interface FeedbackReport {
  session: Session;
  audioAnalysis: AudioAnalysis | null;
  videoAnalysis: VideoAnalysis | null;
  overallScore: number;
  recommendations: string[];
}

// User types
export interface User {
  id: string;
  email: string;
  subscriptionTier: SubscriptionTier;
  credits: number;
  createdAt: Date;
}

export type SubscriptionTier = "free" | "starter" | "pro";

// Practice session config
export interface PracticeConfig {
  topic: string;
  durationMinutes: number;
  enableVideo: boolean;
}
