"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import ListPagination, { LIST_PAGE_SIZE } from "./ListPagination";
import { EmptyState } from "./ui";

export type FilterOption = { value: string; label: string };

const inputCls =
  "rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-600 dark:bg-slate-900";

/** Inclusive YYYY-MM-DD range; empty from/to means no bound. Missing item date fails the range. */
export function matchesDateRange(
  date: string | null | undefined,
  from: string,
  to: string
): boolean {
  if (!from && !to) return true;
  const d = (date || "").slice(0, 10);
  if (!d) return false;
  if (from && d < from) return false;
  if (to && d > to) return false;
  return true;
}

type Props<T> = {
  items: T[];
  searchPlaceholder?: string;
  /** Build searchable text for an item. */
  searchText: (item: T) => string;
  /** Optional status/category filter. */
  statusOptions?: FilterOption[];
  statusValue?: (item: T) => string;
  /** Date used for From/To filter (YYYY-MM-DD). Enables date inputs when set. */
  itemDate?: (item: T) => string | null | undefined;
  emptyMessage?: string;
  children: (filtered: T[]) => ReactNode;
};

export default function FilterableList<T>({
  items,
  searchPlaceholder = "Search…",
  searchText,
  statusOptions,
  statusValue,
  itemDate,
  emptyMessage = "No items match your search.",
  children,
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery =
        query.trim() === "" ||
        searchText(item).toLowerCase().includes(query.toLowerCase());
      const matchesStatus =
        !statusOptions ||
        status === "All" ||
        (statusValue ? statusValue(item) === status : true);
      const matchesDate =
        !itemDate || matchesDateRange(itemDate(item), dateFrom, dateTo);
      return matchesQuery && matchesStatus && matchesDate;
    });
  }, [
    items,
    query,
    status,
    dateFrom,
    dateTo,
    searchText,
    statusOptions,
    statusValue,
    itemDate,
  ]);

  useEffect(() => {
    setPage(1);
  }, [query, status, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIST_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * LIST_PAGE_SIZE,
    safePage * LIST_PAGE_SIZE
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className={`min-w-64 flex-1 ${inputCls}`}
        />
        {statusOptions && statusOptions.length > 0 && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputCls}
          >
            <option value="All">All statuses</option>
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}
        {itemDate && (
          <>
            <label className="flex flex-col gap-1 text-xs text-slate-500">
              From
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={inputCls}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-500">
              To
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={inputCls}
              />
            </label>
          </>
        )}
      </div>
      {filtered.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <>
          {children(pageItems)}
          <ListPagination
            page={safePage}
            total={filtered.length}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
