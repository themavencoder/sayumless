import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();

    const { data: session, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Fetch related data
    const [audioResult, videoResult, recordingsResult] = await Promise.all([
      supabase.from("audio_analysis").select("*").eq("session_id", id),
      supabase.from("video_analysis").select("*").eq("session_id", id),
      supabase.from("recordings").select("*").eq("session_id", id),
    ]);

    return NextResponse.json({
      session,
      audioAnalysis: audioResult.data || [],
      videoAnalysis: videoResult.data || [],
      recordings: recordingsResult.data || [],
    });
  } catch (error) {
    console.error("Session GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = createServerSupabaseClient();

    // Extract only valid session update fields
    const updateData: Record<string, unknown> = {};
    const allowedFields = ["status", "overall_score", "topic", "duration_seconds", "skill_level", "model_selection"];
    for (const key of allowedFields) {
      if (key in body) updateData[key] = body[key];
    }

    const { data: session, error } = await supabase
      .from("sessions")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !session) {
      return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error("Session PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
