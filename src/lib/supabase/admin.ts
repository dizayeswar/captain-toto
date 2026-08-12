import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "../supabaseConfig";

/**
 * Service-role client for privileged Auth Admin calls (create user, etc.).
 * Never import this into client components. Bypasses RLS.
 */
export function getAdminSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!isSupabaseConfigured || !url || !key) return null;
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function isAdminSupabaseConfigured(): boolean {
  return Boolean(
    isSupabaseConfigured && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
