import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white">
              ✈
            </span>
            Captain <span className="text-brand">Toto</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-500">
            Your trusted travel partner for unforgettable journeys around the
            world.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              <Link href="/tours" className="hover:text-brand">
                All tours
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand">
                About us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Get in touch</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>hello@captaintoto.com</li>
            <li>+964 750 000 0000</li>
            <li>Erbil, Kurdistan Region, Iraq</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Captain Toto Travel. All rights reserved.
      </div>
    </footer>
  );
}
