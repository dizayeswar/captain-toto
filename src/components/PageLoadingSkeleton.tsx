export default function PageLoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="border-b border-slate-200 bg-white px-8 py-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="h-7 w-48 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-3 h-4 w-72 max-w-full rounded bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="space-y-4 p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}
