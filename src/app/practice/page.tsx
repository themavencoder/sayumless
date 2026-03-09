"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TimerDisplay } from "@/components/timer";
import { VideoPreview } from "@/components/video-preview";
import { RealTimeOverlay } from "@/components/real-time-overlay";
import { ModelSelector } from "@/components/model-selector";
import { CostEstimate } from "@/components/cost-estimate";
import { GuidedReflection } from "@/components/results/guided-reflection";
import { SessionSummary } from "@/components/results/session-summary";
import { ScoreCard } from "@/components/results/score-card";
import { TranscriptView } from "@/components/results/transcript-view";
import { VideoPlayback } from "@/components/results/video-playback";
import { Recommendations } from "@/components/results/recommendations";
import { Logo } from "@/components/logo";
import { useTimer } from "@/hooks/use-timer";
import { useRecorder } from "@/hooks/use-recorder";
import { useEyeTracking } from "@/hooks/use-eye-tracking";
import { useFillerDetection } from "@/hooks/use-filler-detection";
import { computeOverallScore } from "@/types";
import type { AudioAnalysis, VideoAnalysis, TranscriptWord } from "@/types";
import { Mic, Square, ChevronDown } from "lucide-react";

type SessionState = "setup" | "ready" | "recording" | "processing" | "reflecting" | "complete";

const DURATION_OPTIONS = [
  { label: "1 min", value: 60 },
  { label: "2 min", value: 120 },
  { label: "5 min", value: 300 },
];

const PROCESSING_MESSAGES = [
  "Analyzing speech patterns...",
  "Detecting filler words...",
  "Measuring eye contact...",
  "Calculating speaking pace...",
  "Generating recommendations...",
];

export default function PracticePage() {
  const [sessionState, setSessionState] = useState<SessionState>("setup");
  const [topic, setTopic] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(120);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [processingMessage, setProcessingMessage] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Model selection
  const [transcriptionModel, setTranscriptionModel] = useState("assemblyai");
  const [videoModel, setVideoModel] = useState("mediapipe");

  // Analysis results
  const [audioAnalysis, setAudioAnalysis] = useState<AudioAnalysis | null>(null);
  const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysis | null>(null);
  const [words, setWords] = useState<TranscriptWord[]>([]);
  const [seekTimestamp, setSeekTimestamp] = useState<number | undefined>();

  // Reflection preferences (from guided MCQ)
  const [reflectionPrefs, setReflectionPrefs] = useState<Record<string, string>>({});

  // Real-time feedback captures
  const [finalEyeContact, setFinalEyeContact] = useState(0);
  const [finalFillerCount, setFinalFillerCount] = useState(0);

  const isRecordingActive = sessionState === "recording";

  const handleTimerComplete = useCallback(() => {}, []);

  const timer = useTimer({
    initialSeconds: selectedDuration,
    onComplete: handleTimerComplete,
  });

  const recorder = useRecorder({ video: true, audio: true });
  const eyeTracking = useEyeTracking(videoElement, isRecordingActive);
  const fillerDetection = useFillerDetection(isRecordingActive);

  // Cycle processing messages
  useEffect(() => {
    if (sessionState !== "processing") return;
    const interval = setInterval(() => {
      setProcessingMessage((prev) => (prev + 1) % PROCESSING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [sessionState]);

  const handleGetReady = async () => {
    try {
      setCameraError(null);
      await recorder.initCamera();
      setSessionState("ready");
    } catch (error) {
      console.error("Failed to access camera:", error);
      setCameraError("Could not access camera/microphone. Please grant permissions and try again.");
    }
  };

  const handleStartRecording = async () => {
    try {
      await recorder.startRecording();
      timer.start();
      setSessionState("recording");
    } catch (error) {
      console.error("Failed to start recording:", error);
      setCameraError("Recording failed to start. Please try again.");
    }
  };

  const handleCancelReady = () => {
    recorder.cancelCamera();
    setSessionState("setup");
  };

  const handleStopSession = async () => {
    setFinalEyeContact(eyeTracking.eyeContactPercentage);
    setFinalFillerCount(fillerDetection.fillerCount);

    timer.pause();
    const blob = await recorder.stopRecording();
    setRecordedBlob(blob);
    setSessionState("processing");

    try {
      if (!blob) throw new Error("No recording captured");

      // Run audio and video analysis in parallel
      const audioFormData = new FormData();
      audioFormData.append("file", blob, "recording.webm");

      const videoFormData = new FormData();
      videoFormData.append("file", blob, "recording.webm");
      videoFormData.append("realTimeEyeContact", String(eyeTracking.eyeContactPercentage));

      const [audioRes, videoRes] = await Promise.allSettled([
        fetch("/api/analyze/audio", { method: "POST", body: audioFormData }),
        fetch("/api/analyze/video", { method: "POST", body: videoFormData }),
      ]);

      // Parse audio results
      let audioResult: AudioAnalysis | null = null;
      if (audioRes.status === "fulfilled" && audioRes.value.ok) {
        const audioData = await audioRes.value.json();
        audioResult = {
          id: "live",
          sessionId: "live",
          modelProvider: "deepgram",
          transcription: audioData.transcript || "",
          fillerWords: audioData.fillerWords || [],
          pacingWpm: audioData.pacingWpm || 0,
          clarityScore: audioData.clarityScore || 0,
          confidence: audioData.confidence || 0,
        };
        setWords(audioData.words || []);
      } else {
        console.error("Audio analysis failed:", audioRes.status === "rejected" ? audioRes.reason : await audioRes.value.text());
        // Fallback to real-time filler detection data
        audioResult = {
          id: "local",
          sessionId: "local",
          modelProvider: "deepgram",
          transcription: "Audio analysis failed. Real-time data shown instead.",
          fillerWords: Array.from(fillerDetection.fillerWords.entries()).map(([word, count]) => ({
            word, timestamp: 0, count,
          })),
          pacingWpm: 0,
          clarityScore: 0,
          confidence: 0,
        };
      }

      // Parse video results
      let videoResult: VideoAnalysis | null = null;
      if (videoRes.status === "fulfilled" && videoRes.value.ok) {
        const videoData = await videoRes.value.json();
        videoResult = {
          id: "live",
          sessionId: "live",
          modelProvider: "hume",
          eyeContactPercentage: videoData.eyeContactPercentage || 0,
          confidenceScore: videoData.confidenceScore || 0,
          mannerisms: videoData.mannerisms || [],
          keyFrames: [],
          emotions: videoData.emotions || [],
        };
      } else {
        console.error("Video analysis failed:", videoRes.status === "rejected" ? videoRes.reason : await videoRes.value.text());
        // Fallback to real-time eye tracking data
        videoResult = {
          id: "local",
          sessionId: "local",
          modelProvider: "hume",
          eyeContactPercentage: eyeTracking.eyeContactPercentage,
          confidenceScore: 50,
          mannerisms: [],
          keyFrames: [],
          emotions: [],
        };
      }

      setAudioAnalysis(audioResult);
      setVideoAnalysis(videoResult);
      setSessionState("reflecting");
    } catch (error) {
      console.error("Analysis failed:", error);
      // Fall back to local data on complete failure
      setAudioAnalysis({
        id: "local",
        sessionId: "local",
        modelProvider: "deepgram",
        transcription: "Analysis unavailable. Please check your API keys.",
        fillerWords: Array.from(fillerDetection.fillerWords.entries()).map(([word, count]) => ({
          word, timestamp: 0, count,
        })),
        pacingWpm: 0,
        clarityScore: 0,
        confidence: 0,
      });
      setVideoAnalysis({
        id: "local",
        sessionId: "local",
        modelProvider: "hume",
        eyeContactPercentage: eyeTracking.eyeContactPercentage,
        confidenceScore: 50,
        mannerisms: [],
        keyFrames: [],
        emotions: [],
      });
      setSessionState("reflecting");
    }
  };

  const handleReflectionComplete = (responses: { promptId: string; answer: string }[]) => {
    const prefs: Record<string, string> = {};
    for (const r of responses) {
      prefs[r.promptId] = r.answer;
    }
    setReflectionPrefs(prefs);
    setSessionState("complete");
  };

  const handleSkipReflection = () => {
    setSessionState("complete");
  };

  const handleNewSession = () => {
    setSessionState("setup");
    setTopic("");
    setRecordedBlob(null);
    setVideoElement(null);
    setShowOverlay(true);
    setShowAdvanced(false);
    setFinalEyeContact(0);
    setFinalFillerCount(0);
    setReflectionPrefs({});
    setAudioAnalysis(null);
    setVideoAnalysis(null);
    setWords([]);
    setSeekTimestamp(undefined);
    timer.reset();
  };

  const overallScore = computeOverallScore(audioAnalysis, videoAnalysis);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Header */}
      {sessionState !== "recording" && (
        <header className="glass sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Logo />
          </div>
        </header>
      )}

      <main className="flex-1">
        {/* ===== SETUP STATE ===== */}
        {sessionState === "setup" && (
          <div className="flex items-center justify-center min-h-[80vh] px-4">
            <div className="w-full max-w-lg animate-scale-in">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2 gradient-text">Start a Practice Session</h1>
                <p className="text-muted-foreground">
                  Choose your topic and speak naturally while we record.
                </p>
              </div>

              <Card>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <label htmlFor="topic" className="text-sm font-medium">
                      What will you speak about?
                    </label>
                    <Input
                      id="topic"
                      placeholder="e.g., Introducing myself, Project presentation, Sales pitch..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration</label>
                    <div className="flex gap-2">
                      {DURATION_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSelectedDuration(option.value)}
                          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                            selectedDuration === option.value
                              ? "bg-[#FF6B6B] text-white shadow-lg shadow-[#FF6B6B]/20"
                              : "bg-muted border border-border text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Advanced - Model Selection (hidden by default) */}
                  <div>
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                      Advanced options
                    </button>
                    {showAdvanced && (
                      <div className="mt-3 space-y-3 animate-slide-up">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <ModelSelector
                            type="transcription"
                            selectedModel={transcriptionModel}
                            onSelect={setTranscriptionModel}
                          />
                          <ModelSelector
                            type="video"
                            selectedModel={videoModel}
                            onSelect={setVideoModel}
                          />
                        </div>
                        <CostEstimate
                          transcriptionModel={transcriptionModel}
                          videoModel={videoModel}
                          durationSeconds={selectedDuration}
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    size="lg"
                    className="w-full h-12 text-base"
                    onClick={handleGetReady}
                    disabled={!topic.trim()}
                  >
                    <Mic className="w-5 h-5" />
                    Get Ready
                  </Button>

                  {cameraError && (
                    <p className="text-xs text-red-600 text-center">{cameraError}</p>
                  )}
                  <p className="text-xs text-muted-foreground text-center">
                    We&apos;ll need access to your camera and microphone.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ===== READY STATE (camera preview, not yet recording) ===== */}
        {sessionState === "ready" && (
          <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-slate-950">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white mb-1">You're all set</h2>
              <p className="text-sm text-white/50">
                Check your camera and mic, then hit record when you're ready.
              </p>
            </div>

            <div className="w-full max-w-3xl mb-6">
              <VideoPreview
                stream={recorder.stream}
                isRecording={false}
                className="w-full rounded-2xl"
                onVideoElement={setVideoElement}
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-sm text-white/60">
                {topic}
              </span>
              <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-sm text-white/60">
                {selectedDuration >= 60 ? `${selectedDuration / 60} min` : `${selectedDuration}s`}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <Button
                variant="ghost"
                size="lg"
                onClick={handleCancelReady}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                Back
              </Button>
              <Button
                size="lg"
                onClick={handleStartRecording}
                className="h-14 px-8 text-base rounded-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white"
              >
                <Mic className="w-5 h-5" />
                Start Recording
              </Button>
            </div>

            {recorder.error && (
              <p className="text-sm text-red-400 mt-4">{recorder.error}</p>
            )}
          </div>
        )}

        {/* ===== RECORDING STATE ===== */}
        {sessionState === "recording" && (
          <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-slate-950">
            {/* Top bar */}
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-sm text-white/70">
                {topic}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 pulse-glow" />
                <TimerDisplay
                  formattedTime={timer.formattedTime}
                  progress={timer.progress}
                  isRunning={timer.isRunning}
                />
              </div>
            </div>

            {/* Video */}
            <div className="w-full max-w-3xl">
              <VideoPreview
                stream={recorder.stream}
                isRecording={recorder.isRecording}
                className="w-full rounded-2xl"
                onVideoElement={setVideoElement}
              >
                <RealTimeOverlay
                  eyeContactPercentage={eyeTracking.eyeContactPercentage}
                  isLookingAtCamera={eyeTracking.isLookingAtCamera}
                  eyeTrackingLoading={eyeTracking.isLoading}
                  fillerCount={fillerDetection.fillerCount}
                  lastDetectedWord={fillerDetection.lastDetectedWord}
                  showOverlay={showOverlay}
                  onToggleOverlay={() => setShowOverlay(!showOverlay)}
                />
              </VideoPreview>
            </div>

            {/* Stop button */}
            <div className="mt-8">
              <Button
                variant="destructive"
                size="lg"
                onClick={handleStopSession}
                className="h-14 px-8 text-base rounded-full"
              >
                <Square className="w-5 h-5" />
                Stop Recording
              </Button>
            </div>

            {recorder.error && (
              <p className="text-sm text-red-400 mt-4">{recorder.error}</p>
            )}
            {eyeTracking.error && (
              <p className="text-sm text-amber-400 mt-2">{eyeTracking.error}</p>
            )}
          </div>
        )}

        {/* ===== PROCESSING STATE ===== */}
        {sessionState === "processing" && (
          <div className="flex items-center justify-center min-h-[80vh] px-4">
            <div className="text-center animate-scale-in">
              <Card className="inline-block px-12 py-10">
                <CardContent className="p-0">
                  {/* Gradient conic spinner */}
                  <div className="relative w-16 h-16 mx-auto mb-6">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "conic-gradient(from 0deg, #FF6B6B, #FF8E8E, #FF6B6B, transparent)",
                        animation: "gradient-spin 1.2s linear infinite",
                      }}
                    />
                    <div className="absolute inset-[3px] rounded-full bg-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 gradient-text">Analyzing Your Speech</h2>
                  <p className="text-muted-foreground text-sm h-5 transition-all">
                    {PROCESSING_MESSAGES[processingMessage]}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ===== GUIDED REFLECTION STATE ===== */}
        {sessionState === "reflecting" && (
          <div className="container mx-auto px-4 py-8">
            <GuidedReflection
              videoBlob={recordedBlob}
              onComplete={handleReflectionComplete}
              onSkip={handleSkipReflection}
            />
          </div>
        )}

        {/* ===== COMPLETE STATE ===== */}
        {sessionState === "complete" && (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
              <SessionSummary
                overallScore={overallScore}
                topic={topic}
                durationSeconds={selectedDuration - timer.seconds}
                fillerCount={finalFillerCount}
                pacingWpm={audioAnalysis?.pacingWpm || 0}
                eyeContactPercentage={finalEyeContact}
                confidenceScore={videoAnalysis?.confidenceScore || 0}
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard
                  label="Filler Words"
                  value={Math.max(0, 100 - finalFillerCount * 5)}
                  description={`${finalFillerCount} filler${finalFillerCount !== 1 ? "s" : ""} detected`}
                />
                <ScoreCard
                  label="Pacing"
                  value={audioAnalysis?.pacingWpm || 0}
                  suffix=""
                  description={audioAnalysis?.pacingWpm ? `${audioAnalysis.pacingWpm} WPM` : "Pending API"}
                  max={200}
                  colorThresholds={{ good: 120, warning: 80 }}
                />
                <ScoreCard
                  label="Eye Contact"
                  value={finalEyeContact}
                  suffix="%"
                  description={finalEyeContact >= 70 ? "Excellent" : "Keep practicing"}
                />
                <ScoreCard
                  label="Confidence"
                  value={videoAnalysis?.confidenceScore || 0}
                  description="Based on expressions"
                />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <VideoPlayback
                  videoUrl={null}
                  videoBlob={recordedBlob}
                  fillerWords={audioAnalysis?.fillerWords}
                  seekTo={seekTimestamp}
                />
                <TranscriptView
                  words={words}
                  onSeek={setSeekTimestamp}
                />
              </div>

              <Recommendations
                audioAnalysis={audioAnalysis}
                videoAnalysis={videoAnalysis}
                reflectionPrefs={reflectionPrefs}
              />

              <div className="flex justify-center gap-4 pt-4">
                <Button variant="outline" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
                <Button onClick={handleNewSession}>
                  Start New Session
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
