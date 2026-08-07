import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import { getTourBySlug } from "@/lib/tours";

export async function generateMetadata({
  params,
}: PageProps<"/tours/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return { title: "Tour not found — Captain Toto" };
  return {
    title: `${tour.title} — Captain Toto Travel`,
    description: tour.summary,
  };
}

export default async function TourDetailPage({
  params,
}: PageProps<"/tours/[slug]">) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  return (
    <article>
      {/* Header image */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-6xl px-4 pb-8 text-white">
          <Link href="/tours" className="text-sm text-white/80 hover:text-white">
            ← Back to tours
          </Link>
          <span className="mt-2 block text-sm font-medium">
            📍 {tour.destination}, {tour.country}
          </span>
          <h1 className="mt-1 text-4xl font-extrabold">{tour.title}</h1>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-3">
        {/* Details */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700">
              {tour.category}
            </span>
            <span className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700">
              🗓 {tour.duration_days} days
            </span>
            <span className="rounded-full bg-amber-100 px-4 py-2 font-medium text-amber-700">
              ★ {tour.rating.toFixed(1)} rating
            </span>
          </div>

          <h2 className="mt-8 text-2xl font-bold text-slate-900">
            About this tour
          </h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            {tour.description}
          </p>

          <h2 className="mt-8 text-2xl font-bold text-slate-900">
            What&apos;s included
          </h2>
          <ul className="mt-3 grid gap-2 text-slate-600 sm:grid-cols-2">
            {[
              "Accommodation",
              "Daily breakfast",
              "Expert local guide",
              "Airport transfers",
              "Guided excursions",
              "24/7 support",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-brand">✔</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Booking sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">
                ${tour.price.toLocaleString()}
              </span>
              <span className="text-sm text-slate-400">/ person</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Reserve your spot on <strong>{tour.title}</strong>.
            </p>
            <div className="mt-5">
              <BookingForm tourSlug={tour.slug} tourTitle={tour.title} />
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
