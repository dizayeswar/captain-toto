import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white">
            ✈
          </span>
          <span>
            Captain <span className="text-brand">Toto</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 text-sm font-medium text-slate-600 sm:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition-colors hover:text-brand">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/tours"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Book now
        </Link>
      </nav>
    </header>
  );
}
