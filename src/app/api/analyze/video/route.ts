import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { analyzeVideo } from "@/lib/hume";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const sessionId = formData.get("sessionId") as string | null;
    const realTimeEyeContact = formData.get("realTimeEyeContact");

    if (!file) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "video/webm";

    // Analyze with Hume AI
    const result = await analyzeVideo(buffer, mimeType);

    // If real-time eye tracking data was captured, use it as a more accurate source
    if (realTimeEyeContact !== null && realTimeEyeContact !== undefined) {
      const rtEyeContact = parseFloat(realTimeEyeContact as string);
      if (!isNaN(rtEyeContact)) {
        // Blend real-time data (weighted higher) with Hume estimate
        result.eyeContactPercentage = Math.round(rtEyeContact * 0.7 + result.eyeContactPercentage * 0.3);
      }
    }

    // Save to Supabase if session exists
    if (sessionId) {
      const supabase = createServerSupabaseClient();
      await supabase.from("video_analysis").insert({
        session_id: sessionId,
        model_provider: "hume",
        eye_contact_percentage: result.eyeContactPercentage,
        confidence_score: result.confidenceScore,
        mannerisms: result.mannerisms,
        emotions: result.emotions,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Video analysis error:", error);
    return NextResponse.json(
      { error: "Video analysis failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
