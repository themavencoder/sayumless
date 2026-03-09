import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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
    const type = (formData.get("type") as string) || "video";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (type !== "audio" && type !== "video") {
      return NextResponse.json({ error: "type must be 'audio' or 'video'" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${sessionId || "anonymous"}/${Date.now()}-${type}.webm`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("recordings")
      .upload(fileName, buffer, {
        contentType: file.type || "video/webm",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed", details: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("recordings")
      .getPublicUrl(fileName);

    // Save recording record if we have a session
    if (sessionId) {
      await supabase.from("recordings").insert({
        session_id: sessionId,
        type,
        storage_url: urlData.publicUrl,
        size_bytes: buffer.length,
      });
    }

    return NextResponse.json({
      url: urlData.publicUrl,
      path: uploadData.path,
      size: buffer.length,
    });
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: "Failed to upload file", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
