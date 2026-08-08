"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; icon: string };
type NavGroup = { title: string; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [{ href: "/", label: "Dashboard", icon: "grid" }],
  },
  {
    title: "Data entry",
    items: [{ href: "/bookings", label: "Bookings", icon: "ticket" }],
  },
  {
    title: "Reports",
    items: [
      { href: "/reports/monthly", label: "Monthly Summary", icon: "calendar" },
      { href: "/reports/payments", label: "Payment Report", icon: "card" },
      { href: "/reports/clients", label: "Client Analysis", icon: "user" },
      { href: "/reports/staff", label: "Staff Performance", icon: "users" },
      { href: "/reports/airlines", label: "Airline Analysis", icon: "plane" },
      { href: "/reports/routes", label: "Route Analysis", icon: "map" },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 px-6 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white">
          CT
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-900">Captain ToTo</p>
          <p className="text-xs text-slate-500">Booking System</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {GROUPS.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-brand text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon name={item.icon} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
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
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      );
    case "ticket":
      return (
        <svg {...common}>
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M13 5v14" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "card":
      return (
        <svg {...common}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 21a6 6 0 0 1 12 0" />
          <path d="M16 5a3 3 0 0 1 0 6M21 21a6 6 0 0 0-4-5.7" />
        </svg>
      );
    case "plane":
      return (
        <svg {...common}>
          <path d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a1 1 0 0 0-.9 1.7l6.1 3.4-2.5 2.5-2.4-.6-1 1 3 1.7 1.7 3 1-1-.6-2.4 2.5-2.5 3.4 6.1a1 1 0 0 0 1.7-.9Z" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
          <path d="M9 4v14M15 6v14" />
        </svg>
      );
    default:
      return null;
  }
}
