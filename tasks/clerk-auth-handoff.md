# Clerk Auth + Free Trial — Implementation Status

## Status: VERIFIED

All code changes done, build passes, dev server tested. Auth guards working correctly on all endpoints.

### Testing Results (2026-03-09)
- Build: passes cleanly
- Dev server: starts successfully (Next.js 16.1.6 Turbopack)
- Landing page (`/`): 200 OK, Clerk Sign In button renders, Clerk JS loads
- `/practice`: Clerk middleware protects route (returns auth-redirect for unauthenticated curl)
- `/api/usage`: 401 Unauthorized without auth token
- `/api/sessions` POST: 401 Unauthorized without auth token
- `/api/upload` POST: 401 Unauthorized without auth token
- `/api/analyze/audio` POST: 401 Unauthorized without auth token
- `/api/analyze/video` POST: 401 Unauthorized without auth token
- Fixed: "No account needed" text updated to "3 free sessions per month. No credit card needed."
- Note: Next.js 16 shows middleware deprecation warning (use "proxy" instead) — still functional, Clerk SDK needs to update for proxy API

## What Was Implemented

### New Files
- `src/middleware.ts` — Clerk middleware, protects `/practice` route
- `src/lib/auth.ts` — `getAuthUser()`: gets Clerk user ID, finds/creates Supabase user record
- `src/lib/session-limits.ts` — `getSessionUsage()`: counts sessions this month vs tier limit (free=3, regular=20, unlimited=Infinity)
- `src/app/api/usage/route.ts` — GET endpoint returning `{ tier, used, limit, remaining, canCreateSession }`

### Modified Files
- `package.json` — added `@clerk/nextjs` (v7)
- `.env.local` — Clerk keys added (pk_test + sk_test)
- `src/app/layout.tsx` — Wrapped with `<ClerkProvider afterSignOutUrl="/" signInFallbackRedirectUrl="/practice">`
- `src/app/api/sessions/route.ts` — Replaced anonymous user block with `getAuthUser()` + session limit check on POST (403 if exceeded), GET filtered by authenticated user
- `src/app/api/upload/route.ts` — Added Clerk auth guard (401 if not signed in)
- `src/app/api/analyze/audio/route.ts` — Added Clerk auth guard
- `src/app/api/analyze/video/route.ts` — Added Clerk auth guard
- `src/app/page.tsx` — Landing page header: Sign In button when signed out, "Go to practice" + UserButton when signed in
- `src/app/practice/page.tsx` — Added UserButton in header, "X sessions left" badge, Get Ready button disabled when limit reached with upgrade message

## Architecture Decisions
- **Clerk v7**: No `SignedIn`/`SignedOut` components (removed in v7). Use `auth()` server-side or `useAuth()` client-side.
- **Supabase users table** already had `clerk_id` field — `getAuthUser()` does find-or-create on first login
- **Session counting**: queries `sessions` table filtered by `user_id` + current month
- **Tier limits** from `src/types/index.ts` TIER_LIMITS: free=3/month, regular=20/month, unlimited=Infinity

## Verification Checklist
1. `npm run dev` — app starts without errors
2. Visit `/` — see Sign In button, no auth required
3. Visit `/practice` — redirected to Clerk sign-in modal
4. Sign in with Google or email — redirected to `/practice`, user created in Supabase `users` table
5. Complete 3 sessions — "Get Ready" button disabled, "limit reached" message shown
6. Check `/api/usage` — returns `{ tier: "free", used: 3, limit: 3, remaining: 0, canCreateSession: false }`
7. POST to `/api/sessions` — returns 403 with session limit error

## Clerk Dashboard Config
- App created at clerk.com
- Google OAuth + Email/Password enabled
- Keys in `.env.local`:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...`
  - `CLERK_SECRET_KEY=sk_test_...`
