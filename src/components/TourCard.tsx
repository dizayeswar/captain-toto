import Image from "next/image";
import Link from "next/link";
import type { Tour } from "@/lib/types";

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
          {tour.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            📍 {tour.destination}, {tour.country}
          </span>
          <span className="flex items-center gap-1 font-semibold text-amber-500">
            ★ {tour.rating.toFixed(1)}
          </span>
        </div>

        <h3 className="mt-2 text-lg font-bold text-slate-900 group-hover:text-brand">
          {tour.title}
        </h3>
        <p className="mt-1 flex-1 text-sm text-slate-500">{tour.summary}</p>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm text-slate-500">
            {tour.duration_days} days
          </span>
          <span className="text-lg font-bold text-slate-900">
            ${tour.price.toLocaleString()}
            <span className="text-xs font-normal text-slate-400"> /person</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
