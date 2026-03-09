"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const REFLECTION_PROMPTS = [
  {
    id: "self-assessment",
    step: 1,
    question: "Watch your recording. What's one thing you did well?",
    placeholder: "e.g., I maintained a steady pace, I had a clear opening...",
  },
  {
    id: "improvement",
    step: 2,
    question: "What's one moment you'd change if you could do it again?",
    placeholder: "e.g., I lost my train of thought halfway through, I said 'um' a lot...",
  },
  {
    id: "feeling",
    step: 3,
    question: "How did you feel while speaking? Did your anxiety change over time?",
    placeholder: "e.g., Nervous at first but got more comfortable, Felt confident throughout...",
  },
];

interface GuidedReflectionProps {
  onComplete: (responses: { promptId: string; answer: string }[]) => void;
  onSkip: () => void;
  className?: string;
}

export function GuidedReflection({ onComplete, onSkip, className }: GuidedReflectionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});

  const prompt = REFLECTION_PROMPTS[currentStep];
  const isLastStep = currentStep === REFLECTION_PROMPTS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      const formattedResponses = REFLECTION_PROMPTS.map((p) => ({
        promptId: p.id,
        answer: responses[p.id] || "",
      }));
      onComplete(formattedResponses);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 gradient-text">Before we show your results...</h2>
        <p className="text-muted-foreground">
          Research shows that self-reflection before seeing AI feedback leads to deeper learning.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {REFLECTION_PROMPTS.map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              i <= currentStep
                ? "bg-[#FF6B6B] shadow-sm shadow-[#FF6B6B]/40"
                : "bg-border"
            )}
          />
        ))}
      </div>

      {/* Current prompt */}
      <Card className="mb-6 animate-slide-up">
        <CardContent className="p-8">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Step {prompt.step} of {REFLECTION_PROMPTS.length}
          </div>
          <h3 className="text-lg font-semibold mb-4">{prompt.question}</h3>
          <textarea
            value={responses[prompt.id] || ""}
            onChange={(e) =>
              setResponses({ ...responses, [prompt.id]: e.target.value })
            }
            placeholder={prompt.placeholder}
            rows={3}
            className="w-full bg-muted/50 border border-border rounded-lg p-3 text-sm resize-none
                       focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 focus:border-[#FF6B6B]/50
                       placeholder:text-muted-foreground transition-all"
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onSkip}>
          Skip reflection
        </Button>
        <Button onClick={handleNext} disabled={!responses[prompt.id]?.trim()}>
          {isLastStep ? "See My Results" : "Next"}
        </Button>
      </div>
    </div>
  );
}
