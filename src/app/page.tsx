import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Logo, LogoText } from "@/components/logo";
import { HeroDemo } from "@/components/hero-demo";
import { BeforeAfter } from "@/components/before-after";
import {
  Mic,
  Timer,
  Eye,
  FileText,
  ArrowRight,
  CheckCircle2,
  Play,
  BarChart3,
} from "lucide-react";

export default async function LandingPage() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
          <Logo />
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="#how-it-works">How it works</Link>
            </Button>
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </SignInButton>
                <Button asChild size="sm">
                  <Link href="/practice">Try free</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="sm">
                  <Link href="/practice">Go to practice</Link>
                </Button>
                <UserButton />
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="animate-fade-up">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-5">
                AI speech coaching
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.08]">
                Stop saying{" "}
                <span className="text-muted-foreground/30 line-through decoration-red-400 decoration-2">
                  um
                </span>
                .
                <br />
                <span className="text-foreground/70">
                  Start speaking with clarity.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-md">
                Record a practice speech. AI counts your filler words, measures
                your pacing, and scores your eye contact. See exactly what to
                fix.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="text-base h-12 px-8">
                  <Link href="/practice">
                    Start practicing
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-base h-12 px-8"
                >
                  <Link href="#how-it-works">See how it works</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground/70 mt-4">
                3 free sessions per month. No credit card needed.
              </p>
            </div>

            {/* Right: Demo */}
            <div className="lg:pl-4 animate-fade-up animation-delay-200">
              <HeroDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Social proof / trust strip */}
      <section className="py-10 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Works in your browser
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              No downloads required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Video stays on your device
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Results in 30 seconds
            </span>
          </div>
        </div>
      </section>

      {/* Photo + Problem statement */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] animate-fade-up">
              <Image
                src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80"
                alt="Person speaking at a presentation"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            </div>

            {/* Text */}
            <div className="animate-fade-up animation-delay-200">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight tracking-tight">
                You can&apos;t fix what you can&apos;t see.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Most people have no idea how they come across when speaking. You
                might think you sound confident, but you&apos;re actually saying
                &quot;basically&quot; every 10 seconds.
              </p>
              <p className="text-lg font-medium text-foreground">
                The only way to get better is to watch yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Transformation */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
              See the difference
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Real results from users who practiced with sayumless
            </p>
          </div>
          <BeforeAfter />
        </div>
      </section>

      {/* What you get - Feature Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
              What you get
            </h2>
            <p className="text-muted-foreground">
              Real feedback on real problems
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 stagger-children">
            {/* Feature 1 - Filler Words */}
            <div className="bg-card rounded-xl p-7 border border-border card-hover animate-fade-up">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-5">
                <Mic className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Filler word count</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Every &quot;um&quot;, &quot;uh&quot;, &quot;like&quot;, and
                &quot;you know&quot; counted and timestamped. See exactly where
                you slip up.
              </p>
            </div>

            {/* Feature 2 - Speaking Pace */}
            <div className="bg-card rounded-xl p-7 border border-border card-hover animate-fade-up">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-5">
                <Timer className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Speaking pace</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Words per minute with ideal range indicators. Know if
                you&apos;re rushing or dragging.
              </p>
            </div>

            {/* Feature 3 - Eye Contact */}
            <div className="bg-card rounded-xl p-7 border border-border card-hover animate-fade-up">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-5">
                <Eye className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Eye contact score</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                How often you looked at the camera vs. anywhere else. Build that
                confident presence.
              </p>
            </div>

            {/* Feature 4 - Transcript */}
            <div className="bg-card rounded-xl p-7 border border-border card-hover animate-fade-up">
              <div className="w-10 h-10 rounded-lg bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-5">
                <FileText className="w-5 h-5 text-violet-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Full transcript</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Read back exactly what you said with all filler words
                highlighted in context.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works with photo */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
              How it works
            </h2>
            <p className="text-muted-foreground">
              Three steps to better speaking
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center animate-fade-up">
              <div className="relative mx-auto mb-6 w-48 h-48 rounded-xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80"
                  alt="Person preparing notes"
                  fill
                  className="object-cover"
                  sizes="200px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-white text-foreground flex items-center justify-center text-sm font-bold shadow-md">
                  1
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Pick a topic</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Choose what to practice and set a timer. Elevator pitch?
                Presentation? Interview answer?
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center animate-fade-up animation-delay-200">
              <div className="relative mx-auto mb-6 w-48 h-48 rounded-xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=400&q=80"
                  alt="Person speaking to camera"
                  fill
                  className="object-cover"
                  sizes="200px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-white text-foreground flex items-center justify-center text-sm font-bold shadow-md">
                  2
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Record yourself</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hit record and speak naturally. Just like you would in the real
                situation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center animate-fade-up animation-delay-300">
              <div className="relative mx-auto mb-6 w-48 h-48 rounded-xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80"
                  alt="Analytics dashboard"
                  fill
                  className="object-cover"
                  sizes="200px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-white text-foreground flex items-center justify-center text-sm font-bold shadow-md">
                  3
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get your score</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                See exactly what to fix. Filler words, pacing, eye contact. All
                in about 30 seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-8 tracking-tight">
              People use this for
            </h2>
            <div className="flex flex-wrap justify-center gap-2.5 stagger-children">
              {[
                "Job interviews",
                "Presentations",
                "Sales calls",
                "Meetings",
                "Public speaking",
                "Video calls",
                "YouTube",
                "Podcasts",
              ].map((label) => (
                <span
                  key={label}
                  className="px-4 py-2.5 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors cursor-default animate-fade-up"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Full-width photo break */}
      <section className="relative h-72 sm:h-96 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1559223607-a43c990c692c?w=1400&q=80"
          alt="Speaker presenting on stage to audience"
          fill
          className="object-cover"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Speak like you mean it.
            </h2>
            <p className="text-lg text-white/70 max-w-md mx-auto">
              Every great speaker practiced. Now you have a tool that shows you
              exactly what to work on.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
              Simple pricing
            </h2>
            <p className="text-muted-foreground">
              Free to start. Pay if you use it a lot.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {/* Free */}
            <div className="bg-card border border-border rounded-xl p-7 card-hover">
              <h3 className="text-lg font-semibold mb-1">Free</h3>
              <p className="text-muted-foreground text-sm mb-5">Get started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold tracking-tight">$0</span>
              </div>
              <ul className="space-y-3 text-sm mb-8">
                {[
                  "3 sessions per month",
                  "2 minutes max each",
                  "All core features",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/practice">Start free</Link>
              </Button>
            </div>

            {/* Regular - Highlighted */}
            <div className="relative bg-foreground text-background rounded-xl p-7 card-hover shadow-xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-foreground text-background text-xs font-medium px-3 py-1 rounded-full border border-background/20">
                  Most popular
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1">Regular</h3>
              <p className="text-background/60 text-sm mb-5">
                For serious practice
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold tracking-tight">$10</span>
                <span className="text-background/60 ml-1">/mo</span>
              </div>
              <ul className="space-y-3 text-sm mb-8">
                {[
                  "20 sessions per month",
                  "10 minutes max each",
                  "Session history",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-background/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-background text-foreground hover:bg-background/90"
                asChild
              >
                <Link href="/practice">Get started</Link>
              </Button>
            </div>

            {/* Unlimited */}
            <div className="bg-card border border-border rounded-xl p-7 card-hover">
              <h3 className="text-lg font-semibold mb-1">Unlimited</h3>
              <p className="text-muted-foreground text-sm mb-5">No limits</p>
              <div className="mb-6">
                <span className="text-4xl font-bold tracking-tight">$25</span>
                <span className="text-muted-foreground ml-1">/mo</span>
              </div>
              <ul className="space-y-3 text-sm mb-8">
                {[
                  "Unlimited sessions",
                  "30 minutes max each",
                  "Progress tracking",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/practice">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-5 tracking-tight">
            Ready to sound more confident?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Record your first practice session and see what you actually sound
            like.
          </p>
          <Button asChild size="lg" className="text-base h-12 px-8">
            <Link href="/practice">
              Try it free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between">
          <LogoText size="sm" />
          <p className="text-sm text-muted-foreground">
            Stop saying um.
          </p>
        </div>
      </footer>
    </div>
  );
}
