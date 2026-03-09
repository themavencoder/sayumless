"use client";

import { cn } from "@/lib/utils";
import { TRANSCRIPTION_MODELS, VIDEO_MODELS } from "@/lib/models/config";
import type { ModelInfo, SubscriptionTier } from "@/types";
import { Lock, Zap, Star } from "lucide-react";

interface ModelSelectorProps {
  type: "transcription" | "video";
  selectedModel: string;
  onSelect: (modelId: string) => void;
  userTier?: SubscriptionTier;
  className?: string;
}

export function ModelSelector({
  type,
  selectedModel,
  onSelect,
  userTier = "free",
  className,
}: ModelSelectorProps) {
  const models = type === "transcription" ? TRANSCRIPTION_MODELS : VIDEO_MODELS;
  const canEnsemble = userTier === "unlimited";

  const tierOrder: SubscriptionTier[] = ["free", "regular", "unlimited"];
  const userTierIndex = tierOrder.indexOf(userTier);

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-muted-foreground">
        {type === "transcription" ? "Transcription Model" : "Video Analysis Model"}
      </label>
      <div className="grid gap-2">
        {models.map((model) => {
          const canAccess = tierOrder.indexOf(model.minTier) <= userTierIndex;
          const isSelected = selectedModel === model.id;

          return (
            <ModelOption
              key={model.id}
              model={model}
              isSelected={isSelected}
              canAccess={canAccess}
              onClick={() => canAccess && onSelect(model.id)}
            />
          );
        })}

        {/* Ensemble option */}
        <button
          onClick={() => canEnsemble && onSelect("ensemble")}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg text-left transition-all border",
            selectedModel === "ensemble"
              ? "border-[#FF6B6B]/50 ring-1 ring-[#FF6B6B]/50 bg-[#FFF5F5]"
              : canEnsemble
                ? "border-border/60 bg-white hover:bg-slate-50"
                : "border-border/60 bg-white opacity-60 cursor-not-allowed"
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
            selectedModel === "ensemble"
              ? "bg-[#FF6B6B] text-white"
              : "bg-slate-100"
          )}>
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Use All (Ensemble)</span>
              {!canEnsemble && <Lock className="w-3 h-3 text-muted-foreground" />}
            </div>
            <p className="text-xs text-muted-foreground">
              Run all models, combine the best results
            </p>
          </div>
          {!canEnsemble && (
            <span className="text-[10px] font-medium text-muted-foreground bg-slate-100 px-2 py-0.5 rounded">
              Unlimited
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function ModelOption({
  model,
  isSelected,
  canAccess,
  onClick,
}: {
  model: ModelInfo;
  isSelected: boolean;
  canAccess: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg text-left transition-all border",
        isSelected
          ? "border-[#FF6B6B]/50 ring-1 ring-[#FF6B6B]/50 bg-[#FFF5F5]"
          : canAccess
            ? "border-border/60 bg-white hover:bg-slate-50"
            : "border-border/60 bg-white opacity-60 cursor-not-allowed"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
        isSelected
          ? "bg-[#FF6B6B] text-white"
          : "bg-slate-100"
      )}>
        <Star className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{model.name}</span>
          {!canAccess && <Lock className="w-3 h-3 text-muted-foreground" />}
        </div>
        <p className="text-xs text-muted-foreground truncate">{model.strengths}</p>
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              i < model.accuracyRating
                ? "bg-[#FF6B6B]"
                : "bg-slate-200"
            )}
          />
        ))}
      </div>
    </button>
  );
}
