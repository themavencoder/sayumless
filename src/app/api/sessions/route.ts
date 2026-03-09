import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthUser } from "@/lib/auth";
import { getSessionUsage } from "@/lib/session-limits";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check session limits
    const usage = await getSessionUsage(user);
    if (!usage.canCreateSession) {
      return NextResponse.json(
        { error: `You've used all ${usage.limit} sessions this month. Upgrade your plan for more.` },
        { status: 403 }
      );
    }

    const { topic, durationSeconds, modelSelection } = await request.json();

    if (!topic || !durationSeconds) {
      return NextResponse.json(
        { error: "Missing required fields: topic, durationSeconds" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    const { data: session, error } = await supabase
      .from("sessions")
      .insert({
        user_id: user.id,
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
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }

    // Increment total_sessions
    await supabase
      .from("users")
      .update({ total_sessions: user.totalSessions + 1 })
      .eq("id", user.id);

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Sessions route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const { data: sessions, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", user.id)
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
