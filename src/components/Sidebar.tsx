"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };
type NavSection = { id: string; title: string; icon: string; items: NavItem[] };

const SECTIONS: NavSection[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "dashboard",
    items: [{ href: "/", label: "Overview" }],
  },
  {
    id: "booking",
    title: "Booking",
    icon: "ticket",
    items: [
      { href: "/bookings", label: "Bookings" },
      { href: "/bookings/new", label: "New Booking" },
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
      { href: "/payments/summary", label: "Payments Summary" },
    ],
  },
  {
    id: "hotel",
    title: "Hotel",
    icon: "hotel",
    items: [
      { href: "/hotel", label: "Dashboard" },
      { href: "/hotel/bookings", label: "Hotel Bookings" },
      { href: "/hotel/bookings/new", label: "New Hotel Booking" },
    ],
  },
  {
    id: "visa",
    title: "Visa",
    icon: "visa",
    items: [
      { href: "/visa", label: "Dashboard" },
      { href: "/visa/cases", label: "Visa Cases" },
      { href: "/visa/cases/new", label: "New Visa Case" },
    ],
  },
  {
    id: "suppliers",
    title: "Supplier Finance",
    icon: "supplier",
    items: [
      { href: "/suppliers/dashboard", label: "Dashboard" },
      { href: "/suppliers/invoices", label: "Supplier Invoices" },
      { href: "/suppliers/invoices/new", label: "New Invoice" },
      { href: "/suppliers/receipts", label: "Payment Receipts" },
      { href: "/suppliers/receipts/new", label: "New Payment Receipt" },
      { href: "/suppliers", label: "Suppliers Directory" },
    ],
  },
  {
    id: "finance",
    title: "Finance",
    icon: "finance",
    items: [
      { href: "/finance", label: "Expenses" },
      { href: "/finance/new", label: "New Expense" },
      { href: "/finance/summary", label: "Expense Summary" },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: "settings",
    items: [
      { href: "/settings/appearance", label: "Appearance" },
      { href: "/settings/recycle-bin", label: "Recycle Bin" },
    ],
  },
];

const ALL_HREFS = SECTIONS.flatMap((s) => s.items.map((i) => i.href));

function pathMatches(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/** Highlight the most specific nav item for the current path. */
function isActive(pathname: string, href: string): boolean {
  if (!pathMatches(pathname, href)) return false;
  const better = ALL_HREFS.some(
    (other) =>
      other !== href &&
      other.length > href.length &&
      pathMatches(pathname, other) &&
      (href === "/" || other.startsWith(href + "/"))
  );
  return !better;
}

function sectionOwnsPath(section: NavSection, pathname: string): boolean {
  return section.items.some((item) => pathMatches(pathname, item.href));
}

function openStateForPath(pathname: string): Record<string, boolean> {
  const next: Record<string, boolean> = {};
  for (const s of SECTIONS) next[s.id] = false;

  let best: { id: string; len: number } | null = null;
  for (const s of SECTIONS) {
    for (const item of s.items) {
      if (!pathMatches(pathname, item.href)) continue;
      const len = item.href.length;
      if (!best || len > best.len) best = { id: s.id, len };
    }
  }
  next[best?.id ?? SECTIONS[0].id] = true;
  return next;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    openStateForPath(pathname)
  );

  // Keep only the section for the current page open (accordion)
  useEffect(() => {
    setOpen(openStateForPath(pathname));
  }, [pathname]);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const willOpen = !prev[id];
      const next: Record<string, boolean> = {};
      for (const s of SECTIONS) {
        next[s.id] = willOpen ? s.id === id : false;
      }
      return next;
    });

  return (
    <aside className="no-print flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3 px-6 py-5">
        <Image
          src="/logo.png"
          alt="Captain ToTo"
          width={40}
          height={40}
          className="h-10 w-10"
        />
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Captain ToTo
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Booking System
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {SECTIONS.map((section) => {
          const expanded = open[section.id];
          const sectionActive = sectionOwnsPath(section, pathname);
          return (
            <div key={section.id} className="mb-2">
              <button
                type="button"
                onClick={() => toggle(section.id)}
                className={`nav-section flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold ${
                  sectionActive
                    ? "bg-brand/10 text-brand dark:bg-brand/20 dark:text-sky-300"
                    : "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Icon name={section.icon} />
                <span className="flex-1 text-left">{section.title}</span>
                <Chevron open={!!expanded} />
              </button>

              {expanded && (
                <ul className="mt-1 space-y-1 pl-4">
                  {section.items.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`block rounded-lg px-3 py-2 text-sm ${
                            active
                              ? "bg-brand font-medium text-white"
                              : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
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
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      );
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
    case "hotel":
      return (
        <svg {...common}>
          <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
        </svg>
      );
    case "visa":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="12" r="2" />
          <path d="M14 10h4M14 14h4" />
        </svg>
      );
    case "supplier":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "finance":
      return (
        <svg {...common}>
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
        </svg>
      );
    default:
      return null;
  }
}
