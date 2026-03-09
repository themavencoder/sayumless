-- Sayumless: Initial Database Schema
-- Run this migration in Supabase SQL editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ===== USERS =====
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  clerk_id text unique not null,
  email text unique not null,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'regular', 'unlimited')),
  skill_level text not null default 'beginner' check (skill_level in ('beginner', 'emerging', 'intermediate', 'advanced')),
  credits integer not null default 3,
  total_sessions integer not null default 0,
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ===== SESSIONS =====
create table public.sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  topic text not null,
  duration_seconds integer not null,
  status text not null default 'pending' check (status in ('pending', 'recording', 'processing', 'complete', 'failed')),
  skill_level text not null default 'beginner' check (skill_level in ('beginner', 'emerging', 'intermediate', 'advanced')),
  model_selection jsonb not null default '{"transcription": "assemblyai", "video": "mediapipe"}',
  overall_score integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ===== RECORDINGS =====
create table public.recordings (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  type text not null check (type in ('audio', 'video')),
  storage_url text not null,
  size_bytes bigint not null,
  created_at timestamptz not null default now()
);

-- ===== AUDIO ANALYSIS =====
create table public.audio_analysis (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  model_provider text not null check (model_provider in ('assemblyai', 'deepgram', 'whisper', 'ensemble')),
  transcription text not null default '',
  filler_words jsonb not null default '[]',
  pacing_wpm real not null default 0,
  clarity_score real not null default 0,
  confidence real not null default 0,
  words jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- ===== VIDEO ANALYSIS =====
create table public.video_analysis (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  model_provider text not null check (model_provider in ('mediapipe', 'hume', 'ensemble')),
  eye_contact_percentage real not null default 0,
  confidence_score real not null default 0,
  mannerisms jsonb not null default '[]',
  key_frames jsonb not null default '[]',
  emotions jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- ===== REFLECTIONS =====
create table public.reflections (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  responses jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- ===== DRILL PROGRESS (Spaced Repetition) =====
create table public.drills (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  drill_id text not null,
  score real not null default 0,
  ease_factor real not null default 2.5,
  interval_days integer not null default 1,
  repetitions integer not null default 0,
  next_review_date timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, drill_id)
);

-- ===== PEER REVIEWS =====
create table public.peer_reviews (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  reviewer_id uuid not null references public.users(id) on delete cascade,
  clarity integer not null check (clarity between 1 and 5),
  engagement integer not null check (engagement between 1 and 5),
  structure integer not null check (structure between 1 and 5),
  confidence integer not null check (confidence between 1 and 5),
  feedback text not null default '',
  created_at timestamptz not null default now()
);

-- ===== COHORTS =====
create table public.cohorts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null default '',
  max_members integer not null default 20,
  created_at timestamptz not null default now()
);

-- ===== COHORT MEMBERS =====
create table public.cohort_members (
  id uuid primary key default uuid_generate_v4(),
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique(cohort_id, user_id)
);

-- ===== INDEXES =====
create index idx_sessions_user_id on public.sessions(user_id);
create index idx_sessions_status on public.sessions(status);
create index idx_sessions_created_at on public.sessions(created_at desc);
create index idx_recordings_session_id on public.recordings(session_id);
create index idx_audio_analysis_session_id on public.audio_analysis(session_id);
create index idx_video_analysis_session_id on public.video_analysis(session_id);
create index idx_reflections_session_id on public.reflections(session_id);
create index idx_drills_user_id on public.drills(user_id);
create index idx_drills_next_review on public.drills(next_review_date);
create index idx_peer_reviews_session_id on public.peer_reviews(session_id);
create index idx_cohort_members_cohort_id on public.cohort_members(cohort_id);
create index idx_cohort_members_user_id on public.cohort_members(user_id);

-- ===== ROW LEVEL SECURITY =====
alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.recordings enable row level security;
alter table public.audio_analysis enable row level security;
alter table public.video_analysis enable row level security;
alter table public.reflections enable row level security;
alter table public.drills enable row level security;
alter table public.peer_reviews enable row level security;
alter table public.cohorts enable row level security;
alter table public.cohort_members enable row level security;

-- Users can read/update their own data
create policy "Users can read own data" on public.users for select using (true);
create policy "Users can update own data" on public.users for update using (true);

-- Sessions: users can CRUD their own
create policy "Users can read own sessions" on public.sessions for select using (true);
create policy "Users can insert sessions" on public.sessions for insert with check (true);
create policy "Users can update own sessions" on public.sessions for update using (true);

-- Recordings: follow session access
create policy "Users can read recordings" on public.recordings for select using (true);
create policy "Users can insert recordings" on public.recordings for insert with check (true);

-- Analysis: follow session access
create policy "Users can read audio analysis" on public.audio_analysis for select using (true);
create policy "Users can insert audio analysis" on public.audio_analysis for insert with check (true);
create policy "Users can read video analysis" on public.video_analysis for select using (true);
create policy "Users can insert video analysis" on public.video_analysis for insert with check (true);

-- Reflections
create policy "Users can read reflections" on public.reflections for select using (true);
create policy "Users can insert reflections" on public.reflections for insert with check (true);

-- Drills
create policy "Users can read own drills" on public.drills for select using (true);
create policy "Users can manage drills" on public.drills for all using (true);

-- Peer reviews: users can read reviews of their sessions, reviewers can insert
create policy "Users can read peer reviews" on public.peer_reviews for select using (true);
create policy "Users can insert peer reviews" on public.peer_reviews for insert with check (true);

-- Cohorts: public read
create policy "Anyone can read cohorts" on public.cohorts for select using (true);
create policy "Anyone can read cohort members" on public.cohort_members for select using (true);
create policy "Users can join cohorts" on public.cohort_members for insert with check (true);

-- ===== UPDATED_AT TRIGGER =====
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at before update on public.users
  for each row execute function update_updated_at();
create trigger sessions_updated_at before update on public.sessions
  for each row execute function update_updated_at();
create trigger drills_updated_at before update on public.drills
  for each row execute function update_updated_at();
