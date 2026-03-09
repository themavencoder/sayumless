"use client";

import { ArrowRight } from "lucide-react";

export function BeforeAfter() {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto relative">
      {/* Arrow between cards on desktop */}
      <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Before */}
      <div className="bg-card rounded-xl p-6 border border-border card-hover">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Before
          </span>
        </div>
        <div className="space-y-4">
          <p className="text-base leading-relaxed text-foreground/70">
            &quot;So, <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1 rounded text-sm font-medium">um</span>, I wanted to talk about, <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1 rounded text-sm font-medium">like</span>, our new product and, <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1 rounded text-sm font-medium">you know</span>, <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1 rounded text-sm font-medium">basically</span> the strategy, <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1 rounded text-sm font-medium">um</span>, behind it...&quot;
          </p>
          <div className="flex gap-6 pt-4 border-t border-border">
            <div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 tabular-nums">12</div>
              <div className="text-xs text-muted-foreground">fillers</div>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums">187</div>
              <div className="text-xs text-muted-foreground">wpm</div>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums">34%</div>
              <div className="text-xs text-muted-foreground">eye contact</div>
            </div>
          </div>
        </div>
      </div>

      {/* After */}
      <div className="bg-card rounded-xl p-6 border border-border card-hover">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            After practice
          </span>
        </div>
        <div className="space-y-4">
          <p className="text-base leading-relaxed text-foreground/70">
            &quot;I wanted to talk about our new product launch and the strategy behind it. We&apos;re focusing on three key areas...&quot;
          </p>
          <div className="flex gap-6 pt-4 border-t border-border">
            <div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">0</div>
              <div className="text-xs text-muted-foreground">fillers</div>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums">142</div>
              <div className="text-xs text-muted-foreground">wpm</div>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums">89%</div>
              <div className="text-xs text-muted-foreground">eye contact</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
