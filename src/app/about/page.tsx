import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Captain Toto Travel",
  description: "Learn more about Captain Toto, your trusted travel partner.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900">
            We turn trips into stories
          </h1>
          <p className="mt-4 leading-relaxed text-slate-600">
            Captain Toto is a travel agency built on one simple belief: travel
            should be effortless, memorable, and open to everyone. From tropical
            beaches to snow-capped peaks, our team designs journeys that fit your
            dreams and your budget.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            With handpicked destinations, trusted local partners, and round-the-
            clock support, we take care of every detail so you can focus on the
            adventure.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { n: "50+", l: "Destinations" },
              { n: "10k+", l: "Happy travelers" },
              { n: "4.9★", l: "Average rating" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="text-2xl font-extrabold text-brand">{s.n}</div>
                <div className="mt-1 text-xs text-slate-500">{s.l}</div>
              </div>
            ))}
          </div>

          <Link
            href="/tours"
            className="mt-8 inline-block rounded-full bg-brand px-7 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            See our tours
          </Link>
        </div>

        <div className="relative h-80 overflow-hidden rounded-3xl lg:h-[28rem]">
          <Image
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80"
            alt="Travelers enjoying a view"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
