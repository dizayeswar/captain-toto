"use client";

import { useState } from "react";
import { downloadExcel, type ExcelCell } from "@/lib/excelExport";

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
  label?: string;
  disabled?: boolean;
};

export default function ExportExcelButton({
  filename,
  rows,
  sheetName = "Sheet1",
  sheets,
  label = "Export Excel",
  disabled,
}: Props) {
  const [busy, setBusy] = useState(false);
  const payload =
    sheets ??
    (rows
      ? [{ name: sheetName, rows }]
      : [{ name: sheetName, rows: [] as Record<string, ExcelCell>[] }]);
  const empty = payload.every((s) => s.rows.length === 0);

  return (
    <button
      type="button"
      disabled={disabled || busy || empty}
      onClick={() => {
        setBusy(true);
        try {
          downloadExcel(filename, payload);
        } finally {
          setBusy(false);
        }
      }}
      title={empty ? "Nothing to export yet" : undefined}
      aria-label="Export to Excel"
      className="page-chrome-btn inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
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
