import Image from "next/image";
import Link from "next/link";
import TourCard from "@/components/TourCard";
import { getFeaturedTours } from "@/lib/tours";

export default async function Home() {
  const featured = await getFeaturedTours();

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden text-white">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
          alt="Tropical beach"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur">
            ✈ Explore the world with Captain Toto
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-6xl">
            Your journey begins here
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
            Handpicked tours, unbeatable prices, and memories that last a
            lifetime. Discover your next adventure today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/tours"
              className="rounded-full bg-brand px-7 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Browse tours
            </Link>
            <Link
              href="/contact"
              className="rounded-full bg-white/15 px-7 py-3 font-semibold backdrop-blur transition-colors hover:bg-white/25"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      {/* Featured tours */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured tours</h2>
            <p className="mt-1 text-slate-500">
              Our travelers&apos; most-loved destinations.
            </p>
          </div>
          <Link
            href="/tours"
            className="hidden text-sm font-semibold text-brand hover:text-brand-dark sm:block"
          >
            View all →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            Why travel with Captain Toto?
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: "🌍",
                title: "Handpicked destinations",
                text: "Every tour is curated by our travel experts for the best possible experience.",
              },
              {
                icon: "💰",
                title: "Best price guarantee",
                text: "Premium journeys at fair, transparent prices with no hidden fees.",
              },
              {
                icon: "🛟",
                title: "24/7 support",
                text: "Our team is with you before, during, and after your trip — anytime.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center"
              >
                <div className="text-4xl">{f.icon}</div>
                <h3 className="mt-3 text-lg font-bold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl bg-gradient-to-r from-brand to-brand-dark px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold">Ready for your next adventure?</h2>
          <p className="mx-auto mt-2 max-w-xl text-white/90">
            Let Captain Toto plan the trip of your dreams. Browse our tours or
            get in touch for a custom itinerary.
          </p>
          <Link
            href="/tours"
            className="mt-6 inline-block rounded-full bg-white px-7 py-3 font-semibold text-brand-dark transition-transform hover:scale-105"
          >
            Start exploring
          </Link>
        </div>
      </section>
    </>
  );
}
