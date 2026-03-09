// ===== Model Provider Types =====

export type ModelProvider = "assemblyai" | "deepgram" | "whisper";
export type VideoModelProvider = "mediapipe" | "hume";

export interface ModelSelection {
  transcription: ModelProvider | "ensemble";
  video: VideoModelProvider | "ensemble";
}

export interface ModelInfo {
  id: ModelProvider | VideoModelProvider;
  name: string;
  type: "transcription" | "video";
  strengths: string;
  accuracyRating: number; // 1-5
  speedRating: number; // 1-5
  costPerMinute: number;
  minTier: SubscriptionTier;
}

// ===== Session Types =====

export interface Session {
  id: string;
  userId: string;
  topic: string;
  durationSeconds: number;
  status: SessionStatus;
  skillLevel: SkillLevel;
  modelSelection: ModelSelection;
  overallScore: number | null;
  createdAt: Date;
}

export type SessionStatus = "pending" | "recording" | "processing" | "complete" | "failed";

export type SkillLevel = "beginner" | "emerging" | "intermediate" | "advanced";

// ===== Recording Types =====

export interface Recording {
  id: string;
  sessionId: string;
  type: "audio" | "video";
  storageUrl: string;
  sizeBytes: number;
}

// ===== Audio Analysis Types =====

export interface AudioAnalysis {
  id: string;
  sessionId: string;
  modelProvider: ModelProvider | "ensemble";
  transcription: string;
  fillerWords: FillerWord[];
  pacingWpm: number;
  clarityScore: number;
  confidence: number;
}

export interface FillerWord {
  word: string;
  timestamp: number;
  count: number;
}

export interface TranscriptionResult {
  transcript: string;
  words: TranscriptWord[];
  fillerWords: FillerWord[];
  pacingWpm: number;
  clarityScore: number;
  confidence: number;
  modelProvider: ModelProvider;
  durationSeconds: number;
}

export interface TranscriptWord {
  text: string;
  start: number;
  end: number;
  confidence: number;
  isFiller: boolean;
}

// ===== Video Analysis Types =====

export interface VideoAnalysis {
  id: string;
  sessionId: string;
  modelProvider: VideoModelProvider | "ensemble";
  eyeContactPercentage: number;
  confidenceScore: number;
  mannerisms: Mannerism[];
  keyFrames: KeyFrame[];
  emotions: EmotionSnapshot[];
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

export interface EmotionSnapshot {
  timestamp: number;
  emotions: Record<string, number>;
  dominantEmotion: string;
}

// ===== Real-Time Feedback Types =====

export interface RealTimeFeedback {
  eyeContactPercentage: number;
  isLookingAtCamera: boolean;
  fillerCount: number;
  fillerWords: Map<string, number>;
  lastDetectedWord: string | null;
}

// ===== Feedback & Results Types =====

export interface FeedbackReport {
  session: Session;
  audioAnalysis: AudioAnalysis | null;
  videoAnalysis: VideoAnalysis | null;
  overallScore: number;
  recommendations: string[];
  reflection: ReflectionResponse | null;
}

export interface ReflectionPrompt {
  id: string;
  step: number;
  question: string;
  placeholder: string;
}

export interface ReflectionResponse {
  sessionId: string;
  responses: { promptId: string; answer: string }[];
  completedAt: Date;
}

// ===== Scoring =====

export function computeOverallScore(audio: AudioAnalysis | null, video: VideoAnalysis | null): number {
  if (!audio && !video) return 0;

  const fillerScore = audio ? Math.max(0, 100 - audio.fillerWords.reduce((sum, fw) => sum + fw.count, 0) * 5) : 50;
  const pacingScore = audio ? Math.max(0, 100 - Math.abs(140 - audio.pacingWpm)) : 50;
  const eyeContactScore = video ? video.eyeContactPercentage : 50;
  const confidenceScore = video ? video.confidenceScore : 50;

  return Math.round(
    fillerScore * 0.30 +
    pacingScore * 0.20 +
    eyeContactScore * 0.25 +
    confidenceScore * 0.25
  );
}

// ===== Micro-Skill Drills =====

export interface MicroDrill {
  id: string;
  name: string;
  skillCategory: DrillCategory;
  difficulty: SkillLevel;
  instructions: string;
  durationMinutes: number;
  evaluationCriteria: string[];
}

export type DrillCategory =
  | "opening-hooks"
  | "pause-mastery"
  | "eye-contact"
  | "storytelling"
  | "qa-handling"
  | "vocal-variety"
  | "body-language";

// ===== Spaced Repetition =====

export interface SpacedRepetitionItem {
  drillId: string;
  userId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
  lastScore: number;
}

// ===== Community & Cohorts =====

export interface CohortChallenge {
  id: string;
  cohortId: string;
  title: string;
  description: string;
  drillId: string | null;
  startsAt: Date;
  endsAt: Date;
}

export interface PeerReview {
  id: string;
  sessionId: string;
  reviewerId: string;
  clarity: number; // 1-5
  engagement: number;
  structure: number;
  confidence: number;
  feedback: string;
  createdAt: Date;
}

// ===== User Types =====

export interface User {
  id: string;
  email: string;
  subscriptionTier: SubscriptionTier;
  skillLevel: SkillLevel;
  credits: number;
  totalSessions: number;
  createdAt: Date;
}

export type SubscriptionTier = "free" | "regular" | "unlimited";

export const TIER_LIMITS: Record<SubscriptionTier, TierConfig> = {
  free: {
    sessionsPerMonth: 3,
    maxDurationMinutes: 2,
    historyLimit: 5,
    canUseEnsemble: false,
    canChooseModel: false,
    canPeerReview: false,
  },
  regular: {
    sessionsPerMonth: 20,
    maxDurationMinutes: 10,
    historyLimit: Infinity,
    canUseEnsemble: false,
    canChooseModel: true,
    canPeerReview: true,
  },
  unlimited: {
    sessionsPerMonth: Infinity,
    maxDurationMinutes: 30,
    historyLimit: Infinity,
    canUseEnsemble: true,
    canChooseModel: true,
    canPeerReview: true,
  },
};

export interface TierConfig {
  sessionsPerMonth: number;
  maxDurationMinutes: number;
  historyLimit: number;
  canUseEnsemble: boolean;
  canChooseModel: boolean;
  canPeerReview: boolean;
}

// ===== Practice Config =====

export interface PracticeConfig {
  topic: string;
  durationMinutes: number;
  enableVideo: boolean;
  modelSelection: ModelSelection;
}
