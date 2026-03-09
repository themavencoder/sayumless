"use client";

import { cn } from "@/lib/utils";
import type { TranscriptionResult } from "@/types";

interface ModelComparisonProps {
  results: TranscriptionResult[];
  className?: string;
}

export function ModelComparison({ results, className }: ModelComparisonProps) {
  if (results.length <= 1) return null;

  const metrics = ["pacingWpm", "clarityScore", "confidence"] as const;
  const metricLabels: Record<string, string> = {
    pacingWpm: "Pacing (WPM)",
    clarityScore: "Clarity",
    confidence: "Confidence",
  };

  const bests: Record<string, string> = {};
  for (const metric of metrics) {
    let best = results[0];
    for (const r of results) {
      if (metric === "pacingWpm") {
        if (Math.abs(r.pacingWpm - 140) < Math.abs(best.pacingWpm - 140)) {
          best = r;
        }
      } else if (r[metric] > best[metric]) {
        best = r;
      }
    }
    bests[metric] = best.modelProvider;
  }

  return (
    <div className={cn("bg-white border border-border/60 rounded-2xl p-6 shadow-sm", className)}>
      <h3 className="text-sm font-semibold mb-3">Model Comparison</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Ensemble mode ran multiple AI models. Here&apos;s how they compare.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Metric</th>
              {results.map((r) => (
                <th key={r.modelProvider} className="text-center py-2 px-3 font-medium capitalize">
                  {r.modelProvider}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric} className="border-b last:border-0">
                <td className="py-2 pr-4 text-muted-foreground">{metricLabels[metric]}</td>
                {results.map((r) => {
                  const isBest = bests[metric] === r.modelProvider;
                  const value = metric === "pacingWpm" ? `${r[metric]} WPM` : `${r[metric]}%`;
                  return (
                    <td key={r.modelProvider} className={cn("text-center py-2 px-3 tabular-nums", isBest && "font-bold text-green-600")}>
                      {value}{isBest && " ★"}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td className="py-2 pr-4 text-muted-foreground">Filler Words</td>
              {results.map((r) => (
                <td key={r.modelProvider} className="text-center py-2 px-3 tabular-nums">
                  {r.fillerWords.reduce((sum, fw) => sum + fw.count, 0)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
