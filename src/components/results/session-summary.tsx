"use client";

import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface SessionSummaryProps {
  overallScore: number;
  topic: string;
  durationSeconds: number;
  fillerCount: number;
  pacingWpm: number;
  eyeContactPercentage: number;
  confidenceScore: number;
  className?: string;
}

export function SessionSummary({
  overallScore,
  topic,
  durationSeconds,
  fillerCount,
  pacingWpm,
  eyeContactPercentage,
  confidenceScore,
  className,
}: SessionSummaryProps) {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  const grade = getGrade(overallScore);
  const summary = generateSummary(overallScore, fillerCount, pacingWpm, eyeContactPercentage);

  return (
    <div className={cn("bg-white border border-border/60 rounded-2xl p-6 shadow-sm", className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">{topic}</h2>
          <p className="text-sm text-muted-foreground">
            {minutes}:{seconds.toString().padStart(2, "0")} duration
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className={cn(
              "text-3xl font-bold tabular-nums",
              overallScore >= 70 ? "text-[#FF6B6B]" : grade.color
            )}>
              {overallScore}
            </div>
            <div className="text-xs text-muted-foreground">Overall Score</div>
          </div>
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            grade.bgColor
          )}>
            <Trophy className={cn("w-5 h-5", grade.iconColor)} />
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{summary}</p>

      <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
        <QuickStat label="Fillers" value={fillerCount.toString()} />
        <QuickStat label="WPM" value={pacingWpm.toString()} />
        <QuickStat label="Eye Contact" value={`${eyeContactPercentage}%`} />
        <QuickStat label="Confidence" value={`${confidenceScore}`} />
      </div>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center bg-slate-50 rounded-lg py-2">
      <div className="text-lg font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
}

function getGrade(score: number) {
  if (score >= 80) return { color: "text-green-600", bgColor: "bg-green-50 border border-green-200", iconColor: "text-green-600" };
  if (score >= 60) return { color: "text-amber-600", bgColor: "bg-amber-50 border border-amber-200", iconColor: "text-amber-600" };
  return { color: "text-red-600", bgColor: "bg-red-50 border border-red-200", iconColor: "text-red-600" };
}

function generateSummary(
  score: number,
  fillers: number,
  wpm: number,
  eyeContact: number
): string {
  const parts: string[] = [];

  if (score >= 80) {
    parts.push("Excellent session!");
  } else if (score >= 60) {
    parts.push("Good effort with room to improve.");
  } else {
    parts.push("Keep practicing — every session builds your skills.");
  }

  if (fillers === 0) {
    parts.push("You used zero filler words — impressive!");
  } else if (fillers <= 3) {
    parts.push(`Only ${fillers} filler words detected.`);
  }

  if (wpm >= 120 && wpm <= 160) {
    parts.push("Your pacing was natural and easy to follow.");
  }

  if (eyeContact >= 70) {
    parts.push("Strong eye contact throughout.");
  }

  return parts.join(" ");
}
