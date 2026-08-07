import type { Metadata } from "next";
import ToursExplorer from "@/components/ToursExplorer";
import { getAllTours } from "@/lib/tours";

export const metadata: Metadata = {
  title: "Tours — Captain Toto Travel",
  description: "Browse all tours and destinations offered by Captain Toto.",
};

export default async function ToursPage() {
  const tours = await getAllTours();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Explore our tours</h1>
      <p className="mt-1 text-slate-500">
        Find the perfect trip — filter by category, price, or search a
        destination.
      </p>

      <div className="mt-8">
        <ToursExplorer tours={tours} />
      </div>
    </div>
  );
}
