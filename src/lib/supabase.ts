import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role (for API routes)
export function createServerSupabaseClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Database types (will be generated from Supabase later)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          subscription_tier: string;
          credits: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          topic: string;
          duration_seconds: number;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["sessions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["sessions"]["Insert"]>;
      };
      recordings: {
        Row: {
          id: string;
          session_id: string;
          type: string;
          storage_url: string;
          size_bytes: number;
        };
        Insert: Omit<Database["public"]["Tables"]["recordings"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["recordings"]["Insert"]>;
      };
      audio_analysis: {
        Row: {
          id: string;
          session_id: string;
          transcription: string;
          filler_words: Record<string, unknown>;
          pacing_wpm: number;
          clarity_score: number;
        };
        Insert: Omit<Database["public"]["Tables"]["audio_analysis"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["audio_analysis"]["Insert"]>;
      };
      video_analysis: {
        Row: {
          id: string;
          session_id: string;
          eye_contact_percentage: number;
          confidence_score: number;
          mannerisms: Record<string, unknown>;
          key_frames: Record<string, unknown>;
        };
        Insert: Omit<Database["public"]["Tables"]["video_analysis"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["video_analysis"]["Insert"]>;
      };
    };
  };
}
