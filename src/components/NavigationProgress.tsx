"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** Thin top bar that starts as soon as an in-app link is clicked. */
export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (/^(https?:|mailto:|tel:)/i.test(href)) {
        try {
          const url = new URL(href, window.location.origin);
          if (url.origin !== window.location.origin) return;
        } catch {
          return;
        }
      }

      const next = href.startsWith("http")
        ? new URL(href).pathname + new URL(href).search
        : href;
      const current = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
      if (next === current || next === pathname) return;

      setActive(true);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, searchParams]);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden bg-transparent no-print"
      aria-hidden
    >
      <div className="nav-progress-bar h-full w-1/3 bg-brand" />
    </div>
  );
}
