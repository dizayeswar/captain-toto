"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };
type NavSection = { id: string; title: string; icon: string; items: NavItem[] };

const SECTIONS: NavSection[] = [
  {
    id: "booking",
    title: "Booking",
    icon: "ticket",
    items: [
      { href: "/", label: "Dashboard" },
      { href: "/bookings", label: "Bookings" },
      { href: "/reports/monthly", label: "Monthly Summary" },
      { href: "/reports/payments", label: "Payment Report" },
      { href: "/reports/clients", label: "Client Analysis" },
      { href: "/reports/staff", label: "Staff Performance" },
      { href: "/reports/airlines", label: "Airline Analysis" },
      { href: "/reports/routes", label: "Route Analysis" },
    ],
  },
  {
    id: "invoice",
    title: "Ticket Invoice",
    icon: "invoice",
    items: [
      { href: "/invoices", label: "Invoices" },
      { href: "/invoices/new", label: "New Invoice" },
      { href: "/invoices/policies", label: "Airline Policies" },
    ],
  },
  {
    id: "payment",
    title: "Payment Invoice",
    icon: "receipt",
    items: [
      { href: "/payments", label: "Payment Invoices" },
      { href: "/payments/new", label: "New Payment Invoice" },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function sectionOwnsPath(section: NavSection, pathname: string): boolean {
  // A section is "active" if the current path belongs to any of its items
  // (treating "/" specially so it only belongs to the Dashboard item).
  return section.items.some((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const s of SECTIONS) initial[s.id] = sectionOwnsPath(s, pathname);
    // Ensure at least the first section is open on the dashboard.
    if (!Object.values(initial).some(Boolean)) initial[SECTIONS[0].id] = true;
    return initial;
  });

  const toggle = (id: string) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside className="no-print flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-3 px-6 py-5">
        <Image
          src="/logo.png"
          alt="Captain ToTo"
          width={40}
          height={40}
          className="h-10 w-10"
        />
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-900">Captain ToTo</p>
          <p className="text-xs text-slate-500">Booking System</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {SECTIONS.map((section) => {
          const expanded = open[section.id];
          return (
            <div key={section.id} className="mb-2">
              <button
                type="button"
                onClick={() => toggle(section.id)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                <Icon name={section.icon} />
                <span className="flex-1 text-left">{section.title}</span>
                <Chevron open={expanded} />
              </button>

              {expanded && (
                <ul className="mt-1 space-y-1 pl-4">
                  {section.items.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                            active
                              ? "bg-brand font-medium text-white"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Icon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "ticket":
      return (
        <svg {...common}>
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M13 5v14" />
        </svg>
      );
    case "invoice":
      return (
        <svg {...common}>
          <path d="M4 2h11l5 5v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" />
          <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" />
        </svg>
      );
    case "receipt":
      return (
        <svg {...common}>
          <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 1 2V2l-1 2-3-2-3 2-3-2-3 2-3-2Z" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );
    default:
      return null;
  }
}
