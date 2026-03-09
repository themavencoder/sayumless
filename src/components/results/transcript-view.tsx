"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { TranscriptWord } from "@/types";

interface TranscriptViewProps {
  words: TranscriptWord[];
  onSeek?: (timestamp: number) => void;
  className?: string;
}

export function TranscriptView({ words, onSeek, className }: TranscriptViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (words.length === 0) {
    return (
      <div className={cn("bg-white border border-border/60 rounded-2xl p-6 shadow-sm", className)}>
        <h3 className="text-sm font-semibold mb-3">Transcript</h3>
        <p className="text-sm text-muted-foreground">No transcript available.</p>
      </div>
    );
  }

  return (
    <div className={cn("bg-white border border-border/60 rounded-2xl p-6 shadow-sm", className)}>
      <h3 className="text-sm font-semibold mb-3">Interactive Transcript</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Filler words are highlighted. Click a word to jump to that moment in the video.
      </p>
      <div
        ref={containerRef}
        className="text-sm leading-relaxed max-h-64 overflow-y-auto"
      >
        {words.map((word, i) => (
          <span
            key={`${word.start}-${i}`}
            className={cn(
              "cursor-pointer hover:bg-muted/50 rounded px-0.5 transition-colors",
              word.isFiller && "bg-cyan-100 text-cyan-700 font-medium"
            )}
            onClick={() => onSeek?.(word.start)}
            title={`${formatTimestamp(word.start)}`}
          >
            {word.text}{" "}
          </span>
        ))}
      </div>
    </div>
  );
}

function formatTimestamp(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
