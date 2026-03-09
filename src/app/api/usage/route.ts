import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getSessionUsage } from "@/lib/session-limits";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const usage = await getSessionUsage(user);
  return NextResponse.json(usage);
}
