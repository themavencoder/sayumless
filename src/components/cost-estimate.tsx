"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { ALL_MODELS } from "@/lib/models/config";
import { DollarSign } from "lucide-react";

interface CostEstimateProps {
  transcriptionModel: string;
  videoModel: string;
  durationSeconds: number;
  className?: string;
}

export function CostEstimate({
  transcriptionModel,
  videoModel,
  durationSeconds,
  className,
}: CostEstimateProps) {
  const estimate = useMemo(() => {
    const durationMinutes = durationSeconds / 60;

    const tModel = ALL_MODELS.find((m) => m.id === transcriptionModel);
    const vModel = ALL_MODELS.find((m) => m.id === videoModel);

    const tCost = tModel ? tModel.costPerMinute * durationMinutes : 0;
    const vCost = vModel ? vModel.costPerMinute * durationMinutes : 0;
    const total = tCost + vCost;

    return { tCost, vCost, total, isFree: total === 0 };
  }, [transcriptionModel, videoModel, durationSeconds]);

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg text-xs",
      estimate.isFree
        ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
        : "bg-muted text-muted-foreground",
      className
    )}>
      <DollarSign className="w-3 h-3 shrink-0" />
      {estimate.isFree ? (
        <span>Free — no API costs for this session</span>
      ) : (
        <span>
          Est. cost: <strong className="font-semibold">${estimate.total.toFixed(4)}</strong>
          <span className="opacity-70">
            {" "}({Math.round(durationSeconds / 60)} min)
          </span>
        </span>
      )}
    </div>
  );
}
