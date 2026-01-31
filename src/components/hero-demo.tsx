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
      // Reset after a pause
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
      {/* Mock browser window */}
      <div className="bg-card rounded-xl border shadow-2xl overflow-hidden">
        {/* Browser chrome */}
        <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-background rounded px-3 py-1 text-xs text-muted-foreground">
              sayumless.com
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Stats bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-primary tabular-nums">
                  {fillerCount}
                </div>
                <div className="text-xs text-muted-foreground">filler words</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold tabular-nums">142</div>
                <div className="text-xs text-muted-foreground">words/min</div>
              </div>
              <div className="hidden sm:block">
                <div className="text-3xl sm:text-4xl font-bold tabular-nums">73%</div>
                <div className="text-xs text-muted-foreground">eye contact</div>
              </div>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>

          {/* Transcript */}
          <div className="min-h-[120px]">
            <p className="text-lg leading-relaxed">
              {DEMO_TRANSCRIPT.slice(0, visibleWords).map((item, i) => (
                <span key={i}>
                  {item.isFiller ? (
                    <span className="relative inline-block">
                      <span className="bg-primary/20 text-primary font-medium px-1 rounded">
                        {item.word}
                      </span>
                    </span>
                  ) : (
                    <span>{item.word}</span>
                  )}
                  {" "}
                </span>
              ))}
              <span className="inline-block w-0.5 h-5 bg-foreground animate-pulse" />
            </p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -z-10 -top-4 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -z-10 -bottom-8 -left-8 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
    </div>
  );
}
