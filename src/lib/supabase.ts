import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabaseConfig";

export { isSupabaseConfigured } from "./supabaseConfig";

/**
 * Session-aware Supabase client for Server Components / actions / route handlers.
 * Returns null in demo mode (env not configured).
 */
export async function getSupabase(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return null;
  return createServerSupabaseClient();
}

/**
 * Plain anon client without cookies (rare). Prefer getSupabase() for data access.
 */
export function getAnonSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
