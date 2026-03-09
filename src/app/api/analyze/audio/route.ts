import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { transcribeAudio } from "@/lib/deepgram";
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

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "audio/webm";

    // Transcribe with Deepgram
    const result = await transcribeAudio(buffer, mimeType);

    // Save to Supabase if session exists
    if (sessionId) {
      const supabase = createServerSupabaseClient();
      await supabase.from("audio_analysis").insert({
        session_id: sessionId,
        model_provider: "deepgram",
        transcription: result.transcript,
        filler_words: result.fillerWords,
        pacing_wpm: result.pacingWpm,
        clarity_score: result.clarityScore,
        confidence: result.confidence,
        words: result.words,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Audio analysis error:", error);
    return NextResponse.json(
      { error: "Audio analysis failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
