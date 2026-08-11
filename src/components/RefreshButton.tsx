"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = {
  label?: string;
  className?: string;
};

export default function RefreshButton({
  label = "Refresh",
  className = "",
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          router.refresh();
        });
      }}
      className={`page-chrome-btn inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-70 ${className}`}
      aria-busy={pending}
      title="Refresh page data"
    >
      <svg
        className={`h-4 w-4 ${pending ? "animate-spin" : ""}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
        <polyline points="21 3 21 9 15 9" />
      </svg>
      {label}
    </button>
  );
}
