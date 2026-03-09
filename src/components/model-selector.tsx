"use client";

import { cn } from "@/lib/utils";
import { TRANSCRIPTION_MODELS, VIDEO_MODELS } from "@/lib/models/config";
import type { ModelInfo, SubscriptionTier } from "@/types";
import { Lock, Zap, Star, Check } from "lucide-react";

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
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {type === "transcription" ? "Transcription" : "Video Analysis"}
      </label>
      <div className="space-y-1.5">
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
            "flex items-center gap-2.5 w-full p-2.5 rounded-lg text-left transition-all border",
            selectedModel === "ensemble"
              ? "border-[#FF6B6B] bg-[#FF6B6B]/5 ring-1 ring-[#FF6B6B]/30"
              : canEnsemble
                ? "border-border/60 bg-background hover:bg-muted/50"
                : "border-border/40 bg-muted/30 opacity-50 cursor-not-allowed"
          )}
        >
          <div className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
            selectedModel === "ensemble"
              ? "bg-[#FF6B6B] text-white"
              : "bg-muted"
          )}>
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-foreground">Ensemble</span>
            <p className="text-[11px] text-muted-foreground leading-tight">All models combined</p>
          </div>
          {!canEnsemble && <Lock className="w-3 h-3 text-muted-foreground shrink-0" />}
          {selectedModel === "ensemble" && <Check className="w-3.5 h-3.5 text-[#FF6B6B] shrink-0" />}
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
        "flex items-center gap-2.5 w-full p-2.5 rounded-lg text-left transition-all border",
        isSelected
          ? "border-[#FF6B6B] bg-[#FF6B6B]/5 ring-1 ring-[#FF6B6B]/30"
          : canAccess
            ? "border-border/60 bg-background hover:bg-muted/50"
            : "border-border/40 bg-muted/30 opacity-50 cursor-not-allowed"
      )}
    >
      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
        isSelected
          ? "bg-[#FF6B6B] text-white"
          : "bg-muted"
      )}>
        <Star className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground">{model.name}</span>
        <p className="text-[11px] text-muted-foreground leading-tight truncate">{model.strengths}</p>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1 h-1 rounded-full",
              i < model.accuracyRating
                ? isSelected ? "bg-[#FF6B6B]" : "bg-foreground/40"
                : "bg-border"
            )}
          />
        ))}
      </div>
      {!canAccess && <Lock className="w-3 h-3 text-muted-foreground shrink-0" />}
      {isSelected && <Check className="w-3.5 h-3.5 text-[#FF6B6B] shrink-0" />}
    </button>
  );
}
