"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  formattedTime: string;
  progress: number;
  isRunning: boolean;
  className?: string;
}

export function TimerDisplay({
  formattedTime,
  progress,
  isRunning,
  className,
}: TimerDisplayProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div
        className={cn(
          "text-6xl font-mono font-bold tabular-nums transition-colors",
          isRunning ? "text-primary" : "text-foreground"
        )}
      >
        {formattedTime}
      </div>
      <Progress value={progress} className="w-full max-w-xs h-2" />
      <p className="text-sm text-muted-foreground">
        {isRunning ? "Recording..." : progress > 0 ? "Paused" : "Ready to start"}
      </p>
    </div>
  );
}
