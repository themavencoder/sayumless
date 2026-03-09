import { auth, currentUser } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export interface AuthUser {
  id: string;
  clerkId: string;
  email: string;
  subscriptionTier: "free" | "regular" | "unlimited";
  credits: number;
  totalSessions: number;
}

/**
 * Gets Clerk user and ensures a matching record exists in Supabase users table.
 * Creates the record on first login.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createServerSupabaseClient();

  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", userId)
    .single();

  if (existing) {
    return {
      id: existing.id,
      clerkId: existing.clerk_id,
      email: existing.email,
      subscriptionTier: existing.subscription_tier as AuthUser["subscriptionTier"],
      credits: existing.credits,
      totalSessions: existing.total_sessions,
    };
  }

  // First login — create user record
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "unknown@sayumless.com";

  const { data: newUser, error } = await supabase
    .from("users")
    .insert({
      clerk_id: userId,
      email,
      subscription_tier: "free",
      skill_level: "beginner",
      credits: 3,
      total_sessions: 0,
    })
    .select("*")
    .single();

  if (error || !newUser) {
    console.error("[auth] Failed to create user:", error);
    return null;
  }

  return {
    id: newUser.id,
    clerkId: newUser.clerk_id,
    email: newUser.email,
    subscriptionTier: newUser.subscription_tier as AuthUser["subscriptionTier"],
    credits: newUser.credits,
    totalSessions: newUser.total_sessions,
  };
}
