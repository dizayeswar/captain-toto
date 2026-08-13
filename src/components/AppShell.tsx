"use client";

import { useEffect, useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  if (isLogin) {
    return <main className="h-full">{children}</main>;
  }

  return (
    <div className="flex h-full">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 shrink-0 transform transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </div>

      <div className="flex min-w-0 flex-1 flex-col bg-background">
        <div className="no-print flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg border border-slate-300 p-2 text-slate-700 dark:border-slate-600 dark:text-slate-200"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Captain ToTo
          </p>
        </div>

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
