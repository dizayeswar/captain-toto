"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { updatePasswordAction } from "@/lib/authActions";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabaseConfig";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100";

export default function SetNewPasswordForm() {
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [state, formAction, pending] = useActionState(
    updatePasswordAction,
    null
  );

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setReady(true);
      return;
    }

    const supabase = createBrowserSupabaseClient();

    const sync = async () => {
      const { data } = await supabase.auth.getSession();
      setHasSession(Boolean(data.session));
      setReady(true);
    };

    void sync();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || session) {
        setHasSession(Boolean(session));
        setReady(true);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) {
    return <p className="text-sm text-slate-500">Checking reset link…</p>;
  }

  if (!hasSession) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This reset link is missing or expired. Request a new one from the
          login page.
        </p>
        <Link
          href="/login"
          className="inline-block text-sm font-medium text-[#a47c36] hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Choose a new password for your account.
      </p>
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className={inputClass}
        />
      </div>
      <div>
        <label
          htmlFor="confirm"
          className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Confirm password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className={inputClass}
        />
      </div>
      {state?.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="page-chrome-btn w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}
