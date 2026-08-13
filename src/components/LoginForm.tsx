"use client";

import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  signInAction,
  requestPasswordResetAction,
} from "@/lib/authActions";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const passwordUpdated = searchParams.get("password_updated") === "1";
  const resetLinkError = searchParams.get("error") === "reset_link";
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [loginState, loginAction, loginPending] = useActionState(
    signInAction,
    null
  );
  const [resetState, resetAction, resetPending] = useActionState(
    requestPasswordResetAction,
    null
  );

  useEffect(() => {
    if (searchParams.get("forgot") === "1") setMode("reset");
  }, [searchParams]);

  if (mode === "reset") {
    return (
      <form action={resetAction} className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Enter your account email and we&apos;ll send a reset link.
        </p>
        <div>
          <label
            htmlFor="reset-email"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email
          </label>
          <input
            id="reset-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        {resetState?.error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {resetState.error}
          </p>
        )}
        {resetState?.success && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            {resetState.success}
          </p>
        )}
        <button
          type="submit"
          disabled={resetPending}
          className="page-chrome-btn w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {resetPending ? "Sending…" : "Send reset link"}
        </button>
        <button
          type="button"
          onClick={() => setMode("login")}
          className="w-full text-center text-sm text-[#a47c36] hover:underline"
        >
          Back to sign in
        </button>
      </form>
    );
  }

  return (
    <form action={loginAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      {passwordUpdated && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          Password updated. Sign in with your new password.
        </p>
      )}
      {resetLinkError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          That reset link is invalid or expired. Try Forgot password again.
        </p>
      )}
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      {loginState?.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {loginState.error}
        </p>
      )}
      <button
        type="submit"
        disabled={loginPending}
        className="page-chrome-btn w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {loginPending ? "Signing in…" : "Sign in"}
      </button>
      <button
        type="button"
        onClick={() => setMode("reset")}
        className="w-full text-center text-sm text-[#a47c36] hover:underline"
      >
        Forgot password?
      </button>
    </form>
  );
}
