"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/lib/authActions";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100";

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(
    changePasswordAction,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="current_password"
          className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Current password
        </label>
        <input
          id="current_password"
          name="current_password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>
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
          Confirm new password
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
      {state?.success && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="page-chrome-btn rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
