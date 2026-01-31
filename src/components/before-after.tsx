"use client";

export function BeforeAfter() {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Before */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl" />
        <div className="relative bg-card border rounded-xl p-6 h-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm font-medium text-red-600">Before</span>
          </div>
          <div className="space-y-4">
            <p className="text-lg leading-relaxed">
              &quot;So, <span className="bg-red-100 text-red-700 px-1 rounded">um</span>, I wanted to talk about, <span className="bg-red-100 text-red-700 px-1 rounded">like</span>, our new product and, <span className="bg-red-100 text-red-700 px-1 rounded">you know</span>, <span className="bg-red-100 text-red-700 px-1 rounded">basically</span> the strategy, <span className="bg-red-100 text-red-700 px-1 rounded">um</span>, behind it...&quot;
            </p>
            <div className="flex gap-4 pt-4 border-t">
              <div>
                <div className="text-2xl font-bold text-red-600">12</div>
                <div className="text-xs text-muted-foreground">filler words</div>
              </div>
              <div>
                <div className="text-2xl font-bold">187</div>
                <div className="text-xs text-muted-foreground">wpm (rushing)</div>
              </div>
              <div>
                <div className="text-2xl font-bold">34%</div>
                <div className="text-xs text-muted-foreground">eye contact</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* After */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl" />
        <div className="relative bg-card border rounded-xl p-6 h-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-600">After practice</span>
          </div>
          <div className="space-y-4">
            <p className="text-lg leading-relaxed">
              &quot;I wanted to talk about our new product launch and the strategy behind it. We&apos;re focusing on three key areas...&quot;
            </p>
            <div className="flex gap-4 pt-4 border-t">
              <div>
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-xs text-muted-foreground">filler words</div>
              </div>
              <div>
                <div className="text-2xl font-bold">142</div>
                <div className="text-xs text-muted-foreground">wpm (perfect)</div>
              </div>
              <div>
                <div className="text-2xl font-bold">89%</div>
                <div className="text-xs text-muted-foreground">eye contact</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
