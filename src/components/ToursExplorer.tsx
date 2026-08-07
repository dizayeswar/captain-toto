"use client";

import { useMemo, useState } from "react";
import TourCard from "@/components/TourCard";
import { CATEGORIES } from "@/lib/tours";
import type { Tour } from "@/lib/types";

export default function ToursExplorer({ tours }: { tours: Tour[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(3000);

  const filtered = useMemo(() => {
    return tours.filter((t) => {
      const matchesQuery =
        query.trim() === "" ||
        `${t.title} ${t.destination} ${t.country}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesCategory = category === "All" || t.category === category;
      const matchesPrice = t.price <= maxPrice;
      return matchesQuery && matchesCategory && matchesPrice;
    });
  }, [tours, query, category, maxPrice]);

  return (
    <div>
      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Search
            </label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Destination, country…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="All">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Max price: ${maxPrice.toLocaleString()}
            </label>
            <input
              type="range"
              min={500}
              max={3000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <p className="mt-6 text-sm text-slate-500">
        {filtered.length} {filtered.length === 1 ? "tour" : "tours"} found
      </p>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
          No tours match your filters. Try widening your search.
        </div>
      ) : (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
}
