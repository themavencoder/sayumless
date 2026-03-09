# Sayumless Market Research & Product Strategy

## Market Size
- Speech coaching market: $5.67B (2024) → $9.77B by 2033 (CAGR ~6.2%)
- 75% of people worldwide fear public speaking
- 70% of jobs require presentation abilities

---

## Competitor Landscape

### Direct Competitors

| App | Price | What They Do | Key Weakness |
|---|---|---|---|
| **Yoodli** | Free-$20/mo | AI speech coaching, enterprise roleplay | Desktop-only, pivoted to enterprise, alienating individuals |
| **Orai** | $10/mo ($40/yr) | Mobile AI speech coach, gamified lessons | Chronically buggy, sessions fail mid-recording, paid features broken |
| **Speeko** | $25/mo ($90/yr) | Bite-sized daily exercises, courses | Expensive, surface-level feedback |
| **Poised** | $19/mo ($13/mo annual) | Real-time meeting coach (Zoom/Meet/Teams) | Injects ads into meetings, privacy concerns, meeting-only |
| **VirtualSpeech** | $75-280 | VR-based speaking practice | Requires VR headset, setup complexity |
| **Ultraspeaking** | $35/mo ($295/yr) | Game-based live group practice on Zoom | Requires scheduled sessions, not async |
| **BoldVoice** | $12.50/mo ($150/yr) | Accent/pronunciation training | Narrow focus — pronunciation only, not general speaking |

### Indirect Competitors (Interview Prep)

| App | Price | Relevance |
|---|---|---|
| **Pramp/Exponent** | Free-$79/mo | Peer mock interviews, AI grading |
| **Big Interview** | $39-299 | Video interview training, AI scoring |
| **interviewing.io** | $225+/session | Premium mock interviews with FAANG engineers |
| **Final Round AI** | $96-290/mo | Real-time AI copilot during live interviews (predatory billing complaints) |

---

## Market Gaps — What Nobody Delivers Well

1. **No app combines daily structured practice + progress tracking + adaptive personalization** in affordable, mobile-first package
2. **Every major app is solo practice with AI** — no social/multiplayer element
3. **Fun/game-first experience missing** — current apps feel like homework
4. **No combined AI + human feedback** in same session
5. **No mobile-first drop-in sessions** — Yoodli desktop-only, VirtualSpeech needs VR, Ultraspeaking needs scheduled Zoom
6. **Content quality scoring missing** — everyone scores delivery (pace, fillers) but not argument structure or persuasiveness
7. **Progress that feels real** — users want numeric scores, growth charts, concrete metrics over time

---

## What's Working (Most Praised Features Across All Apps)

1. Filler word detection and tracking — universally praised
2. Real-time feedback during speaking (not just post-analysis)
3. Gamified exercises — Ultraspeaking's games called "revolutionary"
4. Progress tracking over time — trend lines keep users motivated
5. Pace/energy scoring — concrete, actionable
6. Short-form practice — "2 minutes a day" outperforms long commitments
7. Privacy — users strongly prefer local processing

---

## Sayumless Differentiators

1. **Adaptive pipeline is the moat** — "questions change based on answers" throughout entire app (onboarding, pre-session, post-session). Nobody else does this.
2. **Audio-first is a feature, not a limitation** — 18x cheaper than video, enables viable free tier
3. **Practice schedule + streak system** — turns a tool into a daily habit
4. **Interview mode with user's own questions** — killer use case for job seekers

---

## API Cost Breakdown

### Per-Minute Pricing

| Provider | Model | Cost/Min | Notes |
|---|---|---|---|
| **AssemblyAI** | Universal | $0.0025 | Cheapest, $50 free credit |
| **Deepgram** | Nova-2 (batch) | $0.0043 | $200 free credit |
| **Deepgram** | Nova-3 (batch) | $0.0066 | Best quality |
| **OpenAI** | GPT-4o Mini Transcribe | $0.003 | Budget OpenAI option |
| **OpenAI** | Whisper / GPT-4o Transcribe | $0.006 | Standard |
| **Hume AI** | Video + Audio emotion | $0.0828 | 10-30x more expensive than transcription |
| **Hume AI** | Video only (face) | $0.045 | — |
| **MediaPipe** | Eye tracking (client-side) | $0 | Free, runs in browser |

### Cost Per Session (2 minutes)

| Mode | Cost/Session | 30 Sessions/Month |
|---|---|---|
| Audio only (AssemblyAI) | ~$0.006 | ~$0.18 |
| Audio only (Deepgram Nova-3) | ~$0.018 | ~$0.45 |
| Audio + Video (with Hume) | ~$0.18 | ~$5.40 |

**Video emotion analysis is 18x more expensive per session than audio-only.**

### Storage Costs

| What | Size | R2 Cost | Notes |
|---|---|---|---|
| 1 audio recording (2 min) | ~2 MB | Negligible | R2 free tier: 10 GB |
| 100 audio recordings | ~200 MB | $0 (free tier) | — |
| 1 video recording (2 min, 720p) | ~37.5 MB | Negligible | — |
| 100 video recordings | ~3.75 GB | $0.056/mo | R2: $0.015/GB, zero egress |

**Audio storage is essentially free. Video storage is cheap but adds up.**

### Infrastructure Costs

| Service | Free Tier | Paid |
|---|---|---|
| **Vercel** | 100 GB bandwidth, 150K function invocations | $20/mo Pro |
| **Supabase** | 1 GB storage, 50K auth users | $25/mo Pro |
| **Cloudflare R2** | 10 GB storage, zero egress | $0.015/GB/mo |

**Launch cost: $0/month on all free tiers.**

---

## Recommended Pricing Structure

| Tier | Price | Includes | Our Cost/User/Month | Margin |
|---|---|---|---|---|
| **Free** | $0 | 3 audio sessions/month, basic feedback | ~$0.03 | — |
| **Starter** | $9.99/mo | Unlimited audio, dashboard, streaks, saved recordings | ~$0.50 | ~95% |
| **Pro** | $19.99/mo | + 10 video sessions/month, interview mode, weekly reports | ~$2.50 | ~87% |
| **Unlimited** | $29.99/mo | Everything unlimited, video every session, priority processing | ~$6-8 | ~73% |

Annual discount: 40% off (Starter → ~$6/mo, undercuts Orai and Speeko)

AI SaaS margin benchmarks: mature 60-70%, early-stage 50-65%. Our margins are strong.

---

## Recommended Tech Stack

| Service | Use | Cost |
|---|---|---|
| **AssemblyAI** | Transcription ($0.0025/min — cheapest) | Pay per use |
| **MediaPipe** | Eye tracking (client-side, free) | $0 |
| **Hume AI** | Video emotion (premium tier only) | Pay per use |
| **Cloudflare R2** | Recording storage (zero egress) | Free → $0.015/GB |
| **Supabase** | Auth + database + row-level security | Free → $25/mo |
| **Vercel** | Hosting + serverless functions | Free → $20/mo |

---

## Storage Strategy

- **Audio recordings:** Store for all paid users. Cheap (~2 MB each, free on R2)
- **Video recordings:** Don't store by default — process, extract analysis, discard. Pro/Unlimited users can opt to save. Store on R2.
- **Free users:** Session results only (in Supabase DB, tiny). No recordings saved.

---

## Features to Add

### High Priority
1. **Auth + free trial tracking** (Supabase Auth, session counter)
2. **Onboarding pipeline** (adaptive MCQ — goal, struggle, schedule, timeline)
3. **Audio-only mode** (huge cost savings, makes free tier viable)
4. **Dashboard** (session history, streak tracker, score trends)
5. **Interview mode** (paste your questions + answers, practice against them)

### Medium Priority
6. **Daily prompts / question of the day** (push notification, low-effort engagement)
7. **Before/after comparison** (Day 1 vs Day 30 recordings side-by-side)
8. **Saved recordings library** (replay, see trends, share highlights)
9. **Quick mode vs deep mode** (audio-only basic feedback vs full video analysis)
10. **Weekly progress email** ("Filler words down 12% this week")

### Lower Priority / Future
11. **Prompt library by category** (interview, presentation, elevator pitch, debate, impromptu)
12. **Content quality scoring** (argument structure, persuasiveness — not just delivery)
13. **Social features** (share progress, challenge friends)
14. **Team/enterprise tier** (manager dashboard, team analytics)

---

## Build Priority Order

1. Auth + free trial tracking
2. Onboarding pipeline
3. Audio-only mode toggle
4. Dashboard with session history + streaks
5. Interview mode (paste own questions)
