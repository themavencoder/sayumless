import { createServerSupabaseClient } from "@/lib/supabase";
import type { AuthUser } from "@/lib/auth";

const TIER_LIMITS: Record<AuthUser["subscriptionTier"], number> = {
  free: 3,
  regular: 20,
  unlimited: Infinity,
};

export interface SessionUsage {
  tier: AuthUser["subscriptionTier"];
  used: number;
  limit: number;
  remaining: number;
  canCreateSession: boolean;
}

export async function getSessionUsage(user: AuthUser): Promise<SessionUsage> {
  const limit = TIER_LIMITS[user.subscriptionTier];

  if (limit === Infinity) {
    return { tier: user.subscriptionTier, used: 0, limit: Infinity, remaining: Infinity, canCreateSession: true };
  }

  const supabase = createServerSupabaseClient();
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const { count, error } = await supabase
    .from("sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", monthStart.toISOString());

  if (error) {
    console.error("[session-limits] Count error:", error);
    return { tier: user.subscriptionTier, used: 0, limit, remaining: limit, canCreateSession: true };
  }

  const used = count ?? 0;
  const remaining = Math.max(0, limit - used);

  return { tier: user.subscriptionTier, used, limit, remaining, canCreateSession: remaining > 0 };
}
