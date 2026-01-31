import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo, LogoText } from "@/components/logo";
import { HeroDemo } from "@/components/hero-demo";
import { BeforeAfter } from "@/components/before-after";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <Button asChild size="sm">
            <Link href="/practice">Try it free</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
                Stop saying um
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                See exactly how you sound when you speak
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
                Record a practice speech. Get your filler word count, speaking pace,
                and eye contact score. Know exactly what to fix.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="text-base">
                  <Link href="/practice">Record a practice session</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Free to try. No account needed.
              </p>
            </div>

            {/* Right: Demo */}
            <div className="lg:pl-8">
              <HeroDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Transformation */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              See the difference practice makes
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Real results from real users who practiced with sayumless
            </p>
          </div>
          <BeforeAfter />
        </div>
      </section>

      {/* Problem Statement - Dark Section */}
      <section className="py-24 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-8 leading-tight">
              You can&apos;t fix what you can&apos;t see
            </h2>
            <p className="text-xl text-background/70 leading-relaxed mb-8">
              Most people have no idea how they come across when speaking.
              You might think you sound confident, but you&apos;re actually
              saying &quot;basically&quot; every 10 seconds.
            </p>
            <p className="text-2xl font-semibold text-primary">
              The only way to get better is to watch yourself.
            </p>
          </div>
        </div>
      </section>

      {/* What you get - Feature Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">What you get</h2>
              <p className="text-lg text-muted-foreground">Real feedback on real problems</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Feature 1 - Filler Words */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-amber-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative bg-card border rounded-xl p-8 h-full transition-all duration-300 group-hover:border-primary/50">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                    <span className="text-primary font-bold text-2xl">um</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Filler word count</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Every &quot;um&quot;, &quot;uh&quot;, &quot;like&quot;, and &quot;you know&quot; counted and timestamped.
                    See exactly where you slip up.
                  </p>
                </div>
              </div>

              {/* Feature 2 - Speaking Pace */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-amber-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative bg-card border rounded-xl p-8 h-full transition-all duration-300 group-hover:border-primary/50">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                    <span className="text-primary font-mono font-bold text-xl">142</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Speaking pace</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Words per minute with ideal range indicators.
                    Know if you&apos;re rushing or dragging.
                  </p>
                </div>
              </div>

              {/* Feature 3 - Eye Contact */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-amber-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative bg-card border rounded-xl p-8 h-full transition-all duration-300 group-hover:border-primary/50">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                    <span className="text-primary font-mono font-bold text-xl">73%</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Eye contact score</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    How often you looked at the camera vs. anywhere else.
                    Build that confident presence.
                  </p>
                </div>
              </div>

              {/* Feature 4 - Transcript */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-amber-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative bg-card border rounded-xl p-8 h-full transition-all duration-300 group-hover:border-primary/50">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Full transcript</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Read back exactly what you said with all filler words highlighted in context.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Large Steps */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it works</h2>
              <p className="text-lg text-muted-foreground">Three steps to better speaking</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="relative mx-auto mb-8">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                    <span className="text-5xl font-bold text-primary-foreground">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Pick a topic</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Choose what you want to practice and set a timer. Elevator pitch? Project presentation? Job interview answer?
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="relative mx-auto mb-8">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                    <span className="text-5xl font-bold text-primary-foreground">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Record yourself</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Hit record and speak to your camera naturally. Just like you would in the real situation.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="relative mx-auto mb-8">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                    <span className="text-5xl font-bold text-primary-foreground">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Get your score</h3>
                <p className="text-muted-foreground leading-relaxed">
                  See exactly what to fix. Filler words, pacing, eye contact. All in about 30 seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-8">People use this for</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: "💼", label: "Job interviews" },
                { icon: "📊", label: "Presentations" },
                { icon: "📞", label: "Sales calls" },
                { icon: "🤝", label: "Meetings" },
                { icon: "🎤", label: "Public speaking" },
                { icon: "💻", label: "Video calls" },
                { icon: "🎬", label: "YouTube" },
                { icon: "🎙️", label: "Podcasts" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="px-5 py-3 bg-card border rounded-full text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple pricing</h2>
              <p className="text-lg text-muted-foreground">Free to start. Pay if you use it a lot.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Free */}
              <div className="bg-card border rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-2">Free</h3>
                <p className="text-muted-foreground text-sm mb-6">Get started</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$0</span>
                </div>
                <ul className="space-y-3 text-sm mb-8">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    3 sessions per month
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    2 minutes max each
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    All core features
                  </li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/practice">Start free</Link>
                </Button>
              </div>

              {/* Regular - Highlighted */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-amber-500 rounded-2xl blur opacity-75" />
                <div className="relative bg-card border-2 border-primary rounded-2xl p-8">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Regular</h3>
                  <p className="text-muted-foreground text-sm mb-6">For serious practice</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$10</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <ul className="space-y-3 text-sm mb-8">
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      20 sessions per month
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      10 minutes max each
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Session history
                    </li>
                  </ul>
                  <Button className="w-full" asChild>
                    <Link href="/practice">Get started</Link>
                  </Button>
                </div>
              </div>

              {/* Unlimited */}
              <div className="bg-card border rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-2">Unlimited</h3>
                <p className="text-muted-foreground text-sm mb-6">No limits</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$25</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <ul className="space-y-3 text-sm mb-8">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited sessions
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    30 minutes max each
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Progress tracking
                  </li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/practice">Get started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-amber-500/10 to-primary/10" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to sound more confident?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-lg mx-auto">
            Record your first practice session and see what you actually sound like.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
            <Link href="/practice">Try it free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <LogoText size="sm" />
          <p className="text-sm text-muted-foreground">
            Stop saying um.
          </p>
        </div>
      </footer>
    </div>
  );
}
