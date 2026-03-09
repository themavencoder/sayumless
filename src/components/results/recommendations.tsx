"use client";

import { cn } from "@/lib/utils";
import { Lightbulb, Sparkles } from "lucide-react";
import type { AudioAnalysis, VideoAnalysis } from "@/types";

interface RecommendationsProps {
  audioAnalysis: AudioAnalysis | null;
  videoAnalysis: VideoAnalysis | null;
  reflectionPrefs?: Record<string, string>;
  className?: string;
}

interface Tip {
  category: string;
  message: string;
  priority: "high" | "medium" | "low";
  focusArea?: string; // maps to reflection "focus" answer
}

export function Recommendations({ audioAnalysis, videoAnalysis, reflectionPrefs = {}, className }: RecommendationsProps) {
  const tips = generateTips(audioAnalysis, videoAnalysis);
  const prioritized = prioritizeByPreferences(tips, reflectionPrefs);
  const depthFilter = reflectionPrefs.depth || "balanced";

  // Filter by depth preference
  let displayTips = prioritized;
  if (depthFilter === "quick") {
    displayTips = prioritized.slice(0, 2);
  } else if (depthFilter === "balanced") {
    displayTips = prioritized.slice(0, 4);
  }
  // "deep" shows all

  const focusLabel = getFocusLabel(reflectionPrefs.focus);
  const goalLabel = getGoalLabel(reflectionPrefs.goal);

  if (displayTips.length === 0) {
    return (
      <div className={cn("bg-background border border-border/60 rounded-2xl p-6 shadow-sm", className)}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Recommendations
        </h3>
        <p className="text-sm text-green-600">
          Great job! No major areas for improvement detected.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("bg-background border border-border/60 rounded-2xl p-6 shadow-sm", className)}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Recommendations
        </h3>
        {focusLabel && (
          <span className="text-[10px] font-medium bg-[#FF6B6B]/10 text-[#FF6B6B] px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Focused on {focusLabel}
          </span>
        )}
      </div>

      {goalLabel && (
        <p className="text-xs text-muted-foreground mb-3">
          Tailored for: {goalLabel}
        </p>
      )}

      <ul className="space-y-3">
        {displayTips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
            <span className={cn(
              "mt-0.5 w-2.5 h-2.5 rounded-full shrink-0",
              tip.priority === "high"
                ? "bg-gradient-to-br from-red-400 to-red-600"
                : tip.priority === "medium"
                  ? "bg-gradient-to-br from-amber-400 to-amber-600"
                  : "bg-gradient-to-br from-green-400 to-green-600"
            )} />
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {tip.category}
              </span>
              <p className="text-sm">{tip.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function prioritizeByPreferences(tips: Tip[], prefs: Record<string, string>): Tip[] {
  const focus = prefs.focus;
  if (!focus) return tips;

  // Map focus preference to category for boosting
  const focusToCategory: Record<string, string> = {
    fillers: "Filler Words",
    confidence: "Confidence",
    pace: "Pacing",
    presence: "Eye Contact",
  };

  const boostedCategory = focusToCategory[focus];

  return [...tips].sort((a, b) => {
    const aBoost = a.category === boostedCategory ? -1 : 0;
    const bBoost = b.category === boostedCategory ? -1 : 0;
    if (aBoost !== bBoost) return aBoost - bBoost;

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

function getFocusLabel(focus?: string): string | null {
  const labels: Record<string, string> = {
    fillers: "filler words",
    confidence: "confidence",
    pace: "pacing",
    presence: "presence",
  };
  return focus ? labels[focus] || null : null;
}

function getGoalLabel(goal?: string): string | null {
  const labels: Record<string, string> = {
    interview: "Job interview prep",
    presentation: "Presentation practice",
    social: "Social confidence",
    general: "General speaking practice",
  };
  return goal ? labels[goal] || null : null;
}

function generateTips(audio: AudioAnalysis | null, video: VideoAnalysis | null): Tip[] {
  const tips: Tip[] = [];

  if (audio) {
    const totalFillers = audio.fillerWords.reduce((sum, fw) => sum + fw.count, 0);

    if (totalFillers > 10) {
      tips.push({ category: "Filler Words", message: `You used ${totalFillers} filler words. Try pausing silently instead of saying "um" or "uh." Practice the 2-second pause technique.`, priority: "high", focusArea: "fillers" });
    } else if (totalFillers > 5) {
      tips.push({ category: "Filler Words", message: `${totalFillers} filler words detected. You're doing well — focus on replacing the remaining ones with confident pauses.`, priority: "medium", focusArea: "fillers" });
    } else {
      tips.push({ category: "Filler Words", message: `Only ${totalFillers} filler words — excellent control! Keep it up.`, priority: "low", focusArea: "fillers" });
    }

    if (audio.pacingWpm > 170) {
      tips.push({ category: "Pacing", message: `You're speaking at ${audio.pacingWpm} WPM, which is quite fast. Ideal range is 120-160 WPM. Try the "breathe between sentences" technique.`, priority: "high", focusArea: "pace" });
    } else if (audio.pacingWpm < 100) {
      tips.push({ category: "Pacing", message: `At ${audio.pacingWpm} WPM, you're speaking slowly. While deliberate pacing can be powerful, try varying your speed for emphasis.`, priority: "medium", focusArea: "pace" });
    } else if (audio.pacingWpm >= 120 && audio.pacingWpm <= 160) {
      tips.push({ category: "Pacing", message: `Your ${audio.pacingWpm} WPM is in the ideal range. Great natural pacing!`, priority: "low", focusArea: "pace" });
    }
  }

  if (video) {
    if (video.eyeContactPercentage < 40) {
      tips.push({ category: "Eye Contact", message: `${video.eyeContactPercentage}% eye contact is low. Practice looking at the camera lens as if it's a friendly face listening to you.`, priority: "high", focusArea: "presence" });
    } else if (video.eyeContactPercentage < 60) {
      tips.push({ category: "Eye Contact", message: `${video.eyeContactPercentage}% eye contact. Good start! Try to maintain gaze for longer stretches before looking away.`, priority: "medium", focusArea: "presence" });
    } else {
      tips.push({ category: "Eye Contact", message: `${video.eyeContactPercentage}% eye contact — strong presence! You're connecting well.`, priority: "low", focusArea: "presence" });
    }

    if (video.confidenceScore < 40) {
      tips.push({ category: "Confidence", message: "Your confidence score suggests some nervousness. This is totally normal! Try power posing for 2 minutes before your next session.", priority: "medium", focusArea: "confidence" });
    } else if (video.confidenceScore >= 70) {
      tips.push({ category: "Confidence", message: "You projected strong confidence! Your body language and tone are working well together.", priority: "low", focusArea: "confidence" });
    }
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  tips.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  return tips;
}
