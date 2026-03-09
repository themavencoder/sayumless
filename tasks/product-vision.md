# Sayumless Product Vision

## Core Concept
Daily speaking practice platform. Not a one-off tool — users come back every day, work through exercises, track improvement. Branded around removing filler words but the real value is comprehensive speaking improvement.

## User Journey

### 1. Sign Up / Login
- Required to use the app (track free trial usage)
- Free tier: limited sessions per week/month
- Paid tier: unlimited sessions, full dashboard, schedule, analytics

### 2. Onboarding Pipeline (after account creation)
Adaptive MCQ flow (questions change based on answers):
- What's your goal? (job interview, presentation, social confidence, public speaking)
- What's your biggest struggle? (fillers, nerves, pacing, eye contact, structure)
- When do you want to practice? (morning, evening, flexible)
- How many times per day/week?
- What's your timeline? (interview next week, ongoing improvement, event coming up)
- Result: system builds a personalized practice schedule

### 3. Dashboard (logged-in home)
- Practice schedule with daily/weekly targets
- Streak tracker
- Performance trends over time (scores, filler count, pacing, eye contact)
- Areas improving vs. areas needing work
- Next session prompt

### 4. Daily Practice Sessions
**Pre-session:**
- Adaptive MCQ to set context for today's session
- Questions/feedback adapt based on their onboarding answers + history

**Session types by goal:**
- **Interview prep:** User uploads their actual interview questions + answers to practice against
- **Presentation:** Practice with their own slides/topics
- **General:** App generates prompts and topics

**Post-session:**
- Guided reflection (MCQ-based, adaptive)
- Full personalized feedback incorporating:
  - Their onboarding goals
  - Pre-session context
  - Self-assessment
  - AI analysis results
  - Historical comparison (are they improving?)

### 5. Monetization
- Free: X sessions per month, basic feedback
- Paid: unlimited sessions, full dashboard, schedule, deep analytics, question bank

## Key Design Principle
The adaptive MCQ flow is the spine of the entire app — onboarding, pre-session, post-session, and feedback all use it. Every interaction feels personalized, not generic.

## Landing Page
Current landing page focuses on filler word removal — may keep that as the hook but the app delivers much more once they sign up.

## Status
- Vision documented, not yet built
- Current app: single-session recording + analysis (no auth, no persistence)
- Next steps: auth, onboarding, dashboard, session history
