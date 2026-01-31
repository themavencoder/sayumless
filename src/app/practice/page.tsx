"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TimerDisplay } from "@/components/timer";
import { VideoPreview } from "@/components/video-preview";
import { Logo } from "@/components/logo";
import { useTimer } from "@/hooks/use-timer";
import { useRecorder } from "@/hooks/use-recorder";

type SessionState = "setup" | "recording" | "processing" | "complete";

const DURATION_OPTIONS = [
  { label: "1 min", value: 60 },
  { label: "2 min", value: 120 },
  { label: "5 min", value: 300 },
  { label: "10 min", value: 600 },
];

export default function PracticePage() {
  const [sessionState, setSessionState] = useState<SessionState>("setup");
  const [topic, setTopic] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(120); // 2 minutes default
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const handleTimerComplete = useCallback(() => {
    // Timer finished, stop recording
  }, []);

  const timer = useTimer({
    initialSeconds: selectedDuration,
    onComplete: handleTimerComplete,
  });

  const recorder = useRecorder({
    video: true,
    audio: true,
  });

  const handleStartSession = async () => {
    try {
      await recorder.startRecording();
      timer.start();
      setSessionState("recording");
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Could not access camera/microphone. Please grant permissions.");
    }
  };

  const handleStopSession = async () => {
    timer.pause();
    const blob = await recorder.stopRecording();
    setRecordedBlob(blob);
    setSessionState("processing");

    // Simulate processing delay (will be replaced with real API calls)
    setTimeout(() => {
      setSessionState("complete");
    }, 2000);
  };

  const handleNewSession = () => {
    setSessionState("setup");
    setTopic("");
    setRecordedBlob(null);
    timer.reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {sessionState === "setup" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Start a Practice Session</h1>
              <p className="text-muted-foreground">
                Choose your topic and duration, then speak naturally while we record.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Session Setup</CardTitle>
                <CardDescription>
                  Configure your practice session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Topic Input */}
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

                {/* Duration Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <div className="flex gap-2 flex-wrap">
                    {DURATION_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        variant={selectedDuration === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDuration(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Camera Permission Notice */}
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    📹 We&apos;ll need access to your camera and microphone.
                    Your recording is analyzed locally and on secure servers.
                  </p>
                </div>

                {/* Start Button */}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleStartSession}
                  disabled={!topic.trim()}
                >
                  Start Recording
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {sessionState === "recording" && (
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Video Preview */}
              <div>
                <VideoPreview
                  stream={recorder.stream}
                  isRecording={recorder.isRecording}
                  className="w-full"
                />
              </div>

              {/* Timer and Controls */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold mb-1">{topic}</h2>
                  <p className="text-sm text-muted-foreground">Speak naturally!</p>
                </div>

                <TimerDisplay
                  formattedTime={timer.formattedTime}
                  progress={timer.progress}
                  isRunning={timer.isRunning}
                  className="mb-8"
                />

                <div className="flex gap-4">
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={handleStopSession}
                  >
                    Stop Recording
                  </Button>
                </div>

                {recorder.error && (
                  <p className="text-sm text-destructive mt-4">{recorder.error}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {sessionState === "processing" && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">Analyzing Your Speech</h2>
            <p className="text-muted-foreground">
              We&apos;re transcribing your audio and analyzing your video for feedback...
            </p>
          </div>
        )}

        {sessionState === "complete" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Session Complete!</h1>
              <p className="text-muted-foreground">
                Here&apos;s your feedback for: {topic}
              </p>
            </div>

            {/* Placeholder Feedback - will be replaced with real analysis */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🗣️ Filler Words
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">--</div>
                  <p className="text-sm text-muted-foreground">
                    Analysis pending (connect Deepgram API)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    ⏱️ Pacing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">-- WPM</div>
                  <p className="text-sm text-muted-foreground">
                    Analysis pending (connect Deepgram API)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    👁️ Eye Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">--%</div>
                  <p className="text-sm text-muted-foreground">
                    Analysis pending (connect Hume AI)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    💪 Confidence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">--/100</div>
                  <p className="text-sm text-muted-foreground">
                    Analysis pending (connect Hume AI)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recording Info */}
            {recordedBlob && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Recording Saved</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Size: {(recordedBlob.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Type: {recordedBlob.type}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
              <Button onClick={handleNewSession}>
                Start New Session
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
