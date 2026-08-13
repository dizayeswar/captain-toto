"use client";

import { useMemo, useState, type ReactNode } from "react";
import { EmptyState } from "./ui";

export type FilterOption = { value: string; label: string };

type Props<T> = {
  items: T[];
  searchPlaceholder?: string;
  /** Build searchable text for an item. */
  searchText: (item: T) => string;
  /** Optional status/category filter. */
  statusOptions?: FilterOption[];
  statusValue?: (item: T) => string;
  emptyMessage?: string;
  children: (filtered: T[]) => ReactNode;
};

export default function FilterableList<T>({
  items,
  searchPlaceholder = "Search…",
  searchText,
  statusOptions,
  statusValue,
  emptyMessage = "No items match your search.",
  children,
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery =
        query.trim() === "" ||
        searchText(item).toLowerCase().includes(query.toLowerCase());
      const matchesStatus =
        !statusOptions ||
        status === "All" ||
        (statusValue ? statusValue(item) === status : true);
      return matchesQuery && matchesStatus;
    });
  }, [items, query, status, searchText, statusOptions, statusValue]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="min-w-64 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-600 dark:bg-slate-900"
        />
        {statusOptions && statusOptions.length > 0 && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-600 dark:bg-slate-900"
          >
            <option value="All">All statuses</option>
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}
      </div>
      {filtered.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        children(filtered)
      )}
    </div>
  );
}
