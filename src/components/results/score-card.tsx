"use client";

import { cn } from "@/lib/utils";

interface ScoreCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  description: string;
  max?: number;
  colorThresholds?: { good: number; warning: number };
  className?: string;
}

export function ScoreCard({
  label,
  value,
  suffix = "",
  description,
  max = 100,
  colorThresholds = { good: 70, warning: 40 },
  className,
}: ScoreCardProps) {
  const numericValue = typeof value === "number" ? value : 0;
  const percentage = max > 0 ? (numericValue / max) * 100 : 0;

  const isGood = numericValue >= colorThresholds.good;
  const isWarning = numericValue >= colorThresholds.warning;

  const gradientId = `score-${label.replace(/\s/g, "-").toLowerCase()}`;

  const gradientColors = isGood
    ? { start: "#FF6B6B", end: "#22c55e" }
    : isWarning
      ? { start: "#FF6B6B", end: "#f59e0b" }
      : { start: "#FF6B6B", end: "#ef4444" };

  const textColor = isGood
    ? "text-green-600"
    : isWarning
      ? "text-amber-600"
      : "text-red-600";

  return (
    <div className={cn(
      "bg-white border border-border/60 rounded-2xl p-6 flex flex-col items-center gap-3 shadow-sm transition-all hover:shadow-md",
      className
    )}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>

      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradientColors.start} />
              <stop offset="100%" stopColor={gradientColors.end} />
            </linearGradient>
          </defs>
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="currentColor"
            className="text-muted/30"
            strokeWidth="8"
          />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="8"
            strokeDasharray={`${(percentage / 100) * 264} 264`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            "text-2xl font-bold tabular-nums animate-count-up",
            numericValue > 70 ? "gradient-text" : textColor
          )}>
            {value}{suffix}
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">{description}</p>
    </div>
  );
}
