"use client";

import { useState } from "react";
import type { ExcelCell } from "@/lib/excelTypes";

type Sheet = {
  name: string;
  rows: Record<string, ExcelCell>[];
};

type Props = {
  filename: string;
  /** Single sheet rows (uses sheetName). */
  rows?: Record<string, ExcelCell>[];
  sheetName?: string;
  /** Multiple sheets (overrides rows). */
  sheets?: Sheet[];
  /** Lazy-load sheets on click (e.g. dashboard export without loading full tables on page). */
  loadSheets?: () => Promise<Sheet[]>;
  label?: string;
  disabled?: boolean;
};

export default function ExportExcelButton({
  filename,
  rows,
  sheetName = "Sheet1",
  sheets,
  loadSheets,
  label = "Export Excel",
  disabled,
}: Props) {
  const [busy, setBusy] = useState(false);
  const staticPayload =
    sheets ??
    (rows
      ? [{ name: sheetName, rows }]
      : loadSheets
        ? null
        : [{ name: sheetName, rows: [] as Record<string, ExcelCell>[] }]);
  const empty =
    !loadSheets &&
    (staticPayload?.every((s) => s.rows.length === 0) ?? true);

  return (
    <button
      type="button"
      disabled={disabled || busy || empty}
      onClick={async () => {
        setBusy(true);
        try {
          const payload = loadSheets
            ? await loadSheets()
            : (staticPayload as Sheet[]);
          const { downloadExcel } = await import("@/lib/excelExport");
          await downloadExcel(filename, payload);
        } finally {
          setBusy(false);
        }
      }}
      title={empty ? "Nothing to export yet" : "Download Excel (.xlsx)"}
      className="page-chrome-btn inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      <svg
        className={`h-4 w-4 ${busy ? "animate-spin" : ""}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {busy ? "Exporting…" : label}
    </button>
  );
}
