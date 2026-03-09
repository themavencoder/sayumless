import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Client-side Supabase client (lazy to avoid build errors when env vars missing)
let _supabase: ReturnType<typeof createClient> | null = null;
export function getSupabase() {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase URL and anon key are required");
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Keep backward-compatible export (will throw at runtime if env vars missing, but not at build time)
export const supabase = typeof window !== "undefined" && supabaseUrl ? createClient(supabaseUrl, supabaseAnonKey) : (null as unknown as ReturnType<typeof createClient>);

// Server-side Supabase client with service role (for API routes)
export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !supabaseServiceKey) {
    throw new Error("Supabase URL and service role key are required");
  }
  return createClient(url, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Database types — explicit to avoid self-referential type issues
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_id: string;
          email: string;
          subscription_tier: string;
          skill_level: string;
          credits: number;
          total_sessions: number;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          clerk_id: string;
          email: string;
          subscription_tier?: string;
          skill_level?: string;
          credits?: number;
          total_sessions?: number;
          stripe_customer_id?: string | null;
        };
        Update: {
          clerk_id?: string;
          email?: string;
          subscription_tier?: string;
          skill_level?: string;
          credits?: number;
          total_sessions?: number;
          stripe_customer_id?: string | null;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          topic: string;
          duration_seconds: number;
          status: string;
          skill_level: string;
          model_selection: Json;
          overall_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          topic: string;
          duration_seconds: number;
          status?: string;
          skill_level?: string;
          model_selection?: Json;
          overall_score?: number | null;
        };
        Update: {
          user_id?: string;
          topic?: string;
          duration_seconds?: number;
          status?: string;
          skill_level?: string;
          model_selection?: Json;
          overall_score?: number | null;
        };
      };
      recordings: {
        Row: {
          id: string;
          session_id: string;
          type: string;
          storage_url: string;
          size_bytes: number;
          created_at: string;
        };
        Insert: {
          session_id: string;
          type: string;
          storage_url: string;
          size_bytes: number;
        };
        Update: {
          session_id?: string;
          type?: string;
          storage_url?: string;
          size_bytes?: number;
        };
      };
      audio_analysis: {
        Row: {
          id: string;
          session_id: string;
          model_provider: string;
          transcription: string;
          filler_words: Json;
          pacing_wpm: number;
          clarity_score: number;
          confidence: number;
          words: Json;
          created_at: string;
        };
        Insert: {
          session_id: string;
          model_provider: string;
          transcription?: string;
          filler_words?: Json;
          pacing_wpm?: number;
          clarity_score?: number;
          confidence?: number;
          words?: Json;
        };
        Update: {
          session_id?: string;
          model_provider?: string;
          transcription?: string;
          filler_words?: Json;
          pacing_wpm?: number;
          clarity_score?: number;
          confidence?: number;
          words?: Json;
        };
      };
      video_analysis: {
        Row: {
          id: string;
          session_id: string;
          model_provider: string;
          eye_contact_percentage: number;
          confidence_score: number;
          mannerisms: Json;
          key_frames: Json;
          emotions: Json;
          created_at: string;
        };
        Insert: {
          session_id: string;
          model_provider: string;
          eye_contact_percentage?: number;
          confidence_score?: number;
          mannerisms?: Json;
          key_frames?: Json;
          emotions?: Json;
        };
        Update: {
          session_id?: string;
          model_provider?: string;
          eye_contact_percentage?: number;
          confidence_score?: number;
          mannerisms?: Json;
          key_frames?: Json;
          emotions?: Json;
        };
      };
      reflections: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          responses: Json;
          created_at: string;
        };
        Insert: {
          session_id: string;
          user_id: string;
          responses?: Json;
        };
        Update: {
          session_id?: string;
          user_id?: string;
          responses?: Json;
        };
      };
      drills: {
        Row: {
          id: string;
          user_id: string;
          drill_id: string;
          score: number;
          ease_factor: number;
          interval_days: number;
          repetitions: number;
          next_review_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          drill_id: string;
          score?: number;
          ease_factor?: number;
          interval_days?: number;
          repetitions?: number;
          next_review_date?: string;
        };
        Update: {
          user_id?: string;
          drill_id?: string;
          score?: number;
          ease_factor?: number;
          interval_days?: number;
          repetitions?: number;
          next_review_date?: string;
        };
      };
      peer_reviews: {
        Row: {
          id: string;
          session_id: string;
          reviewer_id: string;
          clarity: number;
          engagement: number;
          structure: number;
          confidence: number;
          feedback: string;
          created_at: string;
        };
        Insert: {
          session_id: string;
          reviewer_id: string;
          clarity: number;
          engagement: number;
          structure: number;
          confidence: number;
          feedback?: string;
        };
        Update: {
          session_id?: string;
          reviewer_id?: string;
          clarity?: number;
          engagement?: number;
          structure?: number;
          confidence?: number;
          feedback?: string;
        };
      };
      cohorts: {
        Row: {
          id: string;
          name: string;
          description: string;
          max_members: number;
          created_at: string;
        };
        Insert: {
          name: string;
          description?: string;
          max_members?: number;
        };
        Update: {
          name?: string;
          description?: string;
          max_members?: number;
        };
      };
      cohort_members: {
        Row: {
          id: string;
          cohort_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          cohort_id: string;
          user_id: string;
        };
        Update: {
          cohort_id?: string;
          user_id?: string;
        };
      };
    };
  };
}
