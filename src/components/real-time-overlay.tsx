"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Mic } from "lucide-react";

interface RealTimeOverlayProps {
  eyeContactPercentage: number;
  isLookingAtCamera: boolean;
  eyeTrackingLoading: boolean;
  fillerCount: number;
  lastDetectedWord: string | null;
  showOverlay: boolean;
  onToggleOverlay: () => void;
}

export function RealTimeOverlay({
  eyeContactPercentage,
  isLookingAtCamera,
  eyeTrackingLoading,
  fillerCount,
  lastDetectedWord,
  showOverlay,
  onToggleOverlay,
}: RealTimeOverlayProps) {
  const [fillerPulse, setFillerPulse] = useState(false);

  const prevCountRef = { current: fillerCount };
  if (fillerCount > prevCountRef.current) {
    prevCountRef.current = fillerCount;
    setFillerPulse(true);
    setTimeout(() => setFillerPulse(false), 600);
  }

  // Gradient colors for eye contact gauge
  const gaugeColor = eyeTrackingLoading
    ? "#666"
    : isLookingAtCamera
      ? "url(#eye-gauge-good)"
      : "url(#eye-gauge-warn)";

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* SVG gradient definitions */}
      <svg className="absolute w-0 h-0">
        <defs>
          <linearGradient id="eye-gauge-good" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
          <linearGradient id="eye-gauge-warn" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>

      {/* Toggle button - always visible */}
      <button
        onClick={onToggleOverlay}
        className="absolute top-4 right-4 pointer-events-auto z-10
                   glass hover:bg-white/15 text-white rounded-full p-2
                   transition-colors"
        title={showOverlay ? "Hide live feedback" : "Show live feedback"}
      >
        {showOverlay ? (
          <Eye className="w-4 h-4" />
        ) : (
          <EyeOff className="w-4 h-4" />
        )}
      </button>

      {!showOverlay && (
        <div className="absolute top-4 right-14 glass text-white/70 text-xs
                        rounded-full px-2 py-1">
          Live feedback hidden
        </div>
      )}

      {showOverlay && (
        <>
          {/* Eye Contact Gauge - bottom left */}
          <div className="absolute bottom-4 left-4">
            <div className="glass rounded-lg px-3 py-2 flex items-center gap-2">
              <div className="relative w-8 h-8">
                <svg viewBox="0 0 36 36" className="w-8 h-8 -rotate-90">
                  <circle
                    cx="18" cy="18" r="15"
                    fill="none"
                    stroke="white"
                    strokeOpacity={0.1}
                    strokeWidth="3"
                  />
                  <circle
                    cx="18" cy="18" r="15"
                    fill="none"
                    stroke={gaugeColor}
                    strokeWidth="3"
                    strokeDasharray={`${(eyeContactPercentage / 100) * 94.2} 94.2`}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Eye className={cn(
                    "w-3.5 h-3.5 transition-colors",
                    eyeTrackingLoading ? "text-gray-400" : isLookingAtCamera ? "text-green-400" : "text-amber-400"
                  )} />
                </div>
              </div>
              <div className="text-white">
                <div className="text-sm font-semibold tabular-nums">
                  {eyeTrackingLoading ? "..." : `${eyeContactPercentage}%`}
                </div>
                <div className="text-[10px] text-white/40">Eye contact</div>
              </div>
            </div>
          </div>

          {/* Filler Word Counter - bottom right */}
          <div className="absolute bottom-4 right-4">
            <div className={cn(
              "glass rounded-lg px-3 py-2 flex items-center gap-2 transition-all",
              fillerPulse && "ring-2 ring-cyan-400/50 scale-105"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                fillerCount === 0
                  ? "bg-green-500/20"
                  : fillerCount <= 3
                    ? "bg-amber-500/20"
                    : "bg-red-500/20"
              )}>
                <Mic className={cn(
                  "w-3.5 h-3.5",
                  fillerCount === 0 ? "text-green-400" : fillerCount <= 3 ? "text-amber-400" : "text-red-400"
                )} />
              </div>
              <div className="text-white">
                <div className="text-sm font-semibold tabular-nums">
                  {fillerCount}
                </div>
                <div className="text-[10px] text-white/40">
                  {lastDetectedWord ? `"${lastDetectedWord}"` : "Fillers"}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
