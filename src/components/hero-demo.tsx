"use client";

import { useEffect, useState } from "react";

const DEMO_TRANSCRIPT = [
  { word: "So", isFiller: true },
  { word: "I", isFiller: false },
  { word: "wanted", isFiller: false },
  { word: "to", isFiller: false },
  { word: "talk", isFiller: false },
  { word: "about", isFiller: false },
  { word: "um", isFiller: true },
  { word: "our", isFiller: false },
  { word: "new", isFiller: false },
  { word: "product", isFiller: false },
  { word: "launch", isFiller: false },
  { word: "and", isFiller: false },
  { word: "like", isFiller: true },
  { word: "the", isFiller: false },
  { word: "strategy", isFiller: false },
  { word: "behind", isFiller: false },
  { word: "it", isFiller: false },
  { word: "you", isFiller: false },
  { word: "know", isFiller: true },
  { word: "basically", isFiller: true },
  { word: "we", isFiller: false },
  { word: "need", isFiller: false },
  { word: "to", isFiller: false },
  { word: "um", isFiller: true },
  { word: "focus", isFiller: false },
  { word: "on", isFiller: false },
  { word: "growth", isFiller: false },
];

export function HeroDemo() {
  const [visibleWords, setVisibleWords] = useState(0);
  const [fillerCount, setFillerCount] = useState(0);

  useEffect(() => {
    if (visibleWords >= DEMO_TRANSCRIPT.length) {
      const timeout = setTimeout(() => {
        setVisibleWords(0);
        setFillerCount(0);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      const nextWord = DEMO_TRANSCRIPT[visibleWords];
      if (nextWord?.isFiller) {
        setFillerCount((c) => c + 1);
      }
      setVisibleWords((v) => v + 1);
    }, 200);

    return () => clearTimeout(timeout);
  }, [visibleWords]);

  return (
    <div className="relative">
      {/* Clean card */}
      <div className="bg-card rounded-xl overflow-hidden border border-border shadow-lg">
        {/* Minimal top bar */}
        <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="text-xs text-muted-foreground tracking-wide">
              Live analysis
            </div>
          </div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Stats row */}
          <div className="flex items-end gap-8 mb-6 pb-5 border-b border-border">
            <div>
              <div className="text-4xl sm:text-5xl font-bold tabular-nums tracking-tight">
                {fillerCount}
              </div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                Fillers
              </div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold tabular-nums tracking-tight">
                142
              </div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                WPM
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-4xl sm:text-5xl font-bold tabular-nums tracking-tight">
                73<span className="text-2xl text-muted-foreground">%</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                Eye contact
              </div>
            </div>
          </div>

          {/* Transcript */}
          <div className="min-h-[120px]">
            <p className="text-base sm:text-lg leading-relaxed text-foreground/80">
              {DEMO_TRANSCRIPT.slice(0, visibleWords).map((item, i) => (
                <span key={i}>
                  {item.isFiller ? (
                    <span className="relative inline-block">
                      <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium px-1 rounded text-sm">
                        {item.word}
                      </span>
                    </span>
                  ) : (
                    <span>{item.word}</span>
                  )}
                  {" "}
                </span>
              ))}
              <span className="inline-block w-0.5 h-5 bg-foreground/40 animate-pulse" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
