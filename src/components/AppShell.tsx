"use client";

import { usePathname } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabaseConfig";

export default function AppShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  if (isLogin) {
    return <main className="h-full">{children}</main>;
  }

  return (
    <div className="flex h-full">
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col bg-background">
        {!isSupabaseConfigured && (
          <div className="no-print border-b border-amber-200 bg-amber-50 px-6 py-2 text-center text-xs text-amber-800 dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-200">
            Demo mode — data is stored in memory and resets on restart. Connect
            Supabase (see <code>.env.example</code>) to save permanently.
          </div>
        )}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
