import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { topic, durationSeconds, modelSelection } = await request.json();

    if (!topic || !durationSeconds) {
      return NextResponse.json(
        { error: "Missing required fields: topic, durationSeconds" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // TODO: Get real user ID from auth (Phase 7)
    // For now, get or create a placeholder user
    let userId: string;
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", "anonymous")
      .single();

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({
          clerk_id: "anonymous",
          email: "anonymous@sayumless.com",
          subscription_tier: "free",
          skill_level: "beginner",
          credits: 3,
          total_sessions: 0,
        })
        .select("id")
        .single();

      if (userError || !newUser) {
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }
      userId = newUser.id;
    }

    const { data: session, error } = await supabase
      .from("sessions")
      .insert({
        user_id: userId,
        topic,
        duration_seconds: durationSeconds,
        status: "recording",
        skill_level: "beginner",
        model_selection: modelSelection || {
          transcription: "deepgram",
          video: "hume",
        },
      })
      .select("id")
      .single();

    if (error || !session) {
      console.error("Session creation error:", error);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Sessions route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    // TODO: Filter by authenticated user (Phase 7)
    const { data: sessions, error } = await supabase
      .from("sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
    }

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Sessions GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
