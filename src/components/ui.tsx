import Link from "next/link";
import type { ReactNode } from "react";
import RefreshButton from "./RefreshButton";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 bg-white px-8 py-6 no-print dark:border-slate-700 dark:bg-slate-900">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <RefreshButton />
        {action}
      </div>
    </div>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  type,
}: {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit";
}) {
  const styles: Record<string, string> = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    secondary:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
    danger:
      "border border-red-200 bg-white text-red-600 hover:bg-red-50 dark:border-red-900 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/40",
  };
  const cls = `page-chrome-btn inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${styles[variant]}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} className={cls}>
      {children}
    </button>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  href,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "green" | "amber" | "red";
  href?: string;
}) {
  const tones: Record<string, string> = {
    default: "text-slate-900 dark:text-slate-100",
    green: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    red: "text-red-600 dark:text-red-400",
  };
  const inner = (
    <>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold ${tones[tone]}`}>{value}</p>
      {hint && (
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</p>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-accent/50 dark:hover:bg-slate-700"
      >
        {inner}
      </Link>
    );
  }

  return <Card className="p-5">{inner}</Card>;
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    Pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    Cancelled: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  };
  const cls =
    map[status] ??
    "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {status}
    </span>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
      {message}
    </div>
  );
}
