"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Play, Pause, ChevronRight } from "lucide-react";

// --- Guided MCQ Reflection Tree ---

interface MCQOption {
  id: string;
  label: string;
  emoji: string;
}

interface MCQStep {
  id: string;
  question: string;
  subtitle?: string;
  options: MCQOption[];
  /** Which step to go to after this. If not specified, go to next in sequence. */
  getNextStep?: (selectedId: string) => string | null;
}

const REFLECTION_STEPS: MCQStep[] = [
  {
    id: "goal",
    question: "What were you practicing for?",
    subtitle: "This helps us tailor your feedback",
    options: [
      { id: "interview", label: "Job interview", emoji: "💼" },
      { id: "presentation", label: "Presentation or pitch", emoji: "📊" },
      { id: "social", label: "Social confidence", emoji: "💬" },
      { id: "general", label: "Just practicing", emoji: "🎯" },
    ],
  },
  {
    id: "focus",
    question: "What matters most to you right now?",
    subtitle: "Pick the area you want to improve first",
    options: [
      { id: "fillers", label: "Reducing filler words", emoji: "🔇" },
      { id: "confidence", label: "Sounding more confident", emoji: "💪" },
      { id: "pace", label: "Better pacing & flow", emoji: "⏱️" },
      { id: "presence", label: "Eye contact & presence", emoji: "👁️" },
    ],
  },
  {
    id: "self-rating",
    question: "How do you think that went?",
    subtitle: "Be honest — there's no wrong answer",
    options: [
      { id: "great", label: "Better than expected", emoji: "🌟" },
      { id: "okay", label: "About what I expected", emoji: "👍" },
      { id: "rough", label: "Could have been better", emoji: "😅" },
      { id: "nervous", label: "I was really nervous", emoji: "😰" },
    ],
  },
  {
    id: "depth",
    question: "How detailed do you want your feedback?",
    options: [
      { id: "quick", label: "Quick highlights only", emoji: "⚡" },
      { id: "balanced", label: "Key insights + tips", emoji: "📋" },
      { id: "deep", label: "Deep dive — tell me everything", emoji: "🔬" },
    ],
  },
];

export interface ReflectionPreferences {
  goal: string;
  focus: string;
  selfRating: string;
  depth: string;
  responses: Record<string, string>;
}

interface GuidedReflectionProps {
  videoBlob?: Blob | null;
  onComplete: (responses: { promptId: string; answer: string }[]) => void;
  onSkip: () => void;
  className?: string;
}

export function GuidedReflection({ videoBlob, onComplete, onSkip, className }: GuidedReflectionProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const step = REFLECTION_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === REFLECTION_STEPS.length - 1;
  const progress = ((currentStepIndex + 1) / REFLECTION_STEPS.length) * 100;

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const updatedResponses = { ...responses, [step.id]: selectedOption };
    setResponses(updatedResponses);

    if (isLastStep) {
      // Format and send all responses
      const formattedResponses = Object.entries(updatedResponses).map(([promptId, answer]) => ({
        promptId,
        answer,
      }));
      onComplete(formattedResponses);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
        setSelectedOption(null);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setSelectedOption(responses[REFLECTION_STEPS[currentStepIndex - 1].id] || null);
    }
  };

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 gradient-text">Quick check-in</h2>
        <p className="text-muted-foreground text-sm">
          Help us personalize your feedback — just {REFLECTION_STEPS.length} quick taps
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative h-1 bg-muted rounded-full mb-8 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-[#FF6B6B] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className={cn(
        "transition-all duration-200",
        isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      )}>
        <Card className="mb-6">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">{step.question}</h3>
              {step.subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{step.subtitle}</p>
              )}
            </div>

            {/* MCQ Options */}
            <div className="space-y-2">
              {step.options.map((option) => {
                const isSelected = selectedOption === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all border-2",
                      isSelected
                        ? "border-[#FF6B6B] bg-[#FF6B6B]/5 shadow-sm"
                        : "border-transparent bg-muted/50 hover:bg-muted hover:border-border/60"
                    )}
                  >
                    <span className="text-xl shrink-0">{option.emoji}</span>
                    <span className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-foreground" : "text-foreground/80"
                    )}>
                      {option.label}
                    </span>
                    {isSelected && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-[#FF6B6B] flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video playback (collapsible) */}
      {videoBlob && <ReflectionVideoPlayer videoBlob={videoBlob} />}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentStepIndex > 0 ? (
            <Button variant="ghost" size="sm" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Skip
            </Button>
          )}
        </div>
        <Button
          onClick={handleNext}
          disabled={!selectedOption}
          className="gap-1"
        >
          {isLastStep ? "See My Results" : "Next"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function ReflectionVideoPlayer({ videoBlob }: { videoBlob: Blob }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(videoBlob);
    setVideoSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [videoBlob]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!videoSrc) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-2"
      >
        <Play className="w-3 h-3" />
        {isExpanded ? "Hide recording" : "Watch your recording"}
      </button>
      {isExpanded && (
        <div className="relative rounded-xl overflow-hidden border border-border/60 shadow-sm animate-slide-up">
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full aspect-video object-cover scale-x-[-1] bg-black"
            onEnded={() => setIsPlaying(false)}
            playsInline
          />
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
          >
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              {isPlaying ? (
                <Pause className="w-5 h-5 text-foreground" />
              ) : (
                <Play className="w-5 h-5 text-foreground ml-0.5" />
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
