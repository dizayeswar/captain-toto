"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type TicketPrintSettings = {
  /** Space from physical page top to header */
  topIn: number;
  rightIn: number;
  /** Space from physical page bottom to footer */
  bottomIn: number;
  leftIn: number;
};

const STORAGE_KEY = "captain-toto-ticket-print-layout-v3";

const DEFAULTS: TicketPrintSettings = {
  topIn: 0.08,
  rightIn: 0.17,
  bottomIn: 0.08,
  leftIn: 0.17,
};

const A4_HEIGHT_IN = 11.69;
const A4_WIDTH_IN = 8.27;

function loadSettings(): TicketPrintSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        <span className="font-mono text-xs text-slate-500">
          {value.toFixed(2)} in
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={0.6}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand"
      />
      <input
        type="number"
        min={0}
        max={0.6}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1 w-full rounded border border-slate-200 px-2 py-1 font-mono text-xs"
      />
      {hint ? (
        <p className="mt-0.5 text-[10px] leading-snug text-slate-400">{hint}</p>
      ) : null}
    </label>
  );
}

/**
 * Fixed A4 sheet (210×297mm): header pinned to top padding, footer pinned to
 * bottom padding. @page margin is 0 so we own the full page; browser Margins
 * must be Default/None and Scale Default for this to match print preview.
 */
export default function TicketPrintShell({
  children,
  footer,
}: {
  children: ReactNode;
  footer: ReactNode;
}) {
  const [settings, setSettings] = useState<TicketPrintSettings>(DEFAULTS);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  useEffect(() => {
    const styleId = "ticket-print-live-style";
    let el = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = styleId;
      document.head.appendChild(el);
    }
    // Zero browser page margin — padding on the sheet places header/footer.
    el.textContent = `
      @media print {
        @page {
          size: A4 portrait;
          margin: 0 !important;
        }
        html, body {
          width: ${A4_WIDTH_IN}in !important;
          height: ${A4_HEIGHT_IN}in !important;
        }
        .ticket-print {
          width: ${A4_WIDTH_IN}in !important;
          height: ${A4_HEIGHT_IN}in !important;
          min-height: ${A4_HEIGHT_IN}in !important;
          max-height: ${A4_HEIGHT_IN}in !important;
        }
      }
    `;
    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, []);

  const summary = useMemo(
    () =>
      [
        `Top (header from edge): ${settings.topIn.toFixed(2)}in`,
        `Bottom (footer from edge): ${settings.bottomIn.toFixed(2)}in`,
        `Left: ${settings.leftIn.toFixed(2)}in`,
        `Right: ${settings.rightIn.toFixed(2)}in`,
      ].join("\n"),
    [settings]
  );

  function patch(partial: Partial<TicketPrintSettings>) {
    setSettings((s) => ({ ...s, ...partial }));
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <div className="no-print mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Print layout
            </h2>
            <p className="mt-0.5 max-w-2xl text-xs text-slate-500">
              Drag <span className="font-semibold">Top</span> lower to move the
              header up. Drag <span className="font-semibold">Bottom</span>{" "}
              lower to move the footer down. The preview below already shows
              the full A4 page.
            </p>
            <div className="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950">
              When the print window opens, you MUST set:
              <ul className="mt-1 list-inside list-disc font-medium">
                <li>
                  Margins → <span className="font-bold">Default</span> or{" "}
                  <span className="font-bold">None</span> (not Custom)
                </li>
                <li>
                  Scale → <span className="font-bold">Default</span> (not 98%
                  / Custom — that leaves blank space top &amp; bottom)
                </li>
                <li>Headers and footers → off</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSettings(DEFAULTS)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={copySummary}
              className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
            >
              {copied ? "Copied!" : "Copy settings"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field
            label="Top — header from top edge"
            value={settings.topIn}
            onChange={(topIn) => patch({ topIn })}
            hint="0 = header at the very top"
          />
          <Field
            label="Bottom — footer from bottom edge"
            value={settings.bottomIn}
            onChange={(bottomIn) => patch({ bottomIn })}
            hint="0 = footer at the very bottom"
          />
          <Field
            label="Left margin"
            value={settings.leftIn}
            onChange={(leftIn) => patch({ leftIn })}
          />
          <Field
            label="Right margin"
            value={settings.rightIn}
            onChange={(rightIn) => patch({ rightIn })}
          />
        </div>

        <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-700">
          {summary}
        </pre>
      </div>

      {/* Exact A4 sheet: header absolute top, footer absolute bottom */}
      <div
        className="print-area ticket-print mx-auto bg-white shadow-sm print:mx-0 print:shadow-none"
        style={{
          position: "relative",
          boxSizing: "border-box",
          width: `${A4_WIDTH_IN}in`,
          height: `${A4_HEIGHT_IN}in`,
          maxWidth: "100%",
          paddingTop: `${settings.topIn}in`,
          paddingRight: `${settings.rightIn}in`,
          paddingBottom: `${settings.bottomIn}in`,
          paddingLeft: `${settings.leftIn}in`,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <div
          className="ticket-print-inner"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          <div
            className="ticket-print-body"
            style={{ paddingBottom: "1.1in" }}
          >
            {children}
          </div>

          <div
            className="ticket-print-footer"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {footer}
          </div>
        </div>
      </div>
    </>
  );
}
