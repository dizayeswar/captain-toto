export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

/** Convert a foreign amount to USD using an "FX to USD" multiplier. */
export function toUsd(amount: number, fx: number): number {
  const a = Number(amount) || 0;
  const rate = Number(fx) || 1;
  return Math.round(a * rate * 100) / 100;
}

/** Format a number (no currency symbol) with thousands separators. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value || 0);
}

/** Parse a typed amount that may include commas (e.g. "1,250,000.50"). */
export function parseAmountInput(formatted: string): number {
  const cleaned = String(formatted ?? "")
    .replace(/,/g, "")
    .trim();
  if (cleaned === "" || cleaned === ".") return 0;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Live-format an amount field while typing: digits + optional decimals,
 * with thousands commas on the integer part (e.g. 5000 → 5,000).
 */
export function formatAmountInput(raw: string, maxDecimals = 2): string {
  const stripped = String(raw ?? "").replace(/[^\d.]/g, "");
  if (!stripped) return "";

  const firstDot = stripped.indexOf(".");
  let intDigits: string;
  let decDigits: string | null = null;
  let trailingDot = false;

  if (firstDot === -1) {
    intDigits = stripped;
  } else {
    intDigits = stripped.slice(0, firstDot) || "0";
    const after = stripped.slice(firstDot + 1).replace(/\./g, "");
    trailingDot = after.length === 0 && maxDecimals > 0;
    decDigits = maxDecimals > 0 ? after.slice(0, maxDecimals) : null;
  }

  // Avoid leading zeros like 0005 → keep as typed length for empty int
  intDigits = intDigits.replace(/^0+(?=\d)/, "") || (intDigits.length ? "0" : "");
  const withCommas = intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (trailingDot) return `${withCommas}.`;
  if (decDigits !== null && firstDot !== -1) {
    return `${withCommas}.${decDigits}`;
  }
  return withCommas;
}

/** Format a numeric value for an amount input (with commas). */
export function formatAmountFromNumber(
  value: number,
  maxDecimals = 2
): string {
  const n = Number(value);
  if (!Number.isFinite(n) || n === 0) return n === 0 ? "0" : "";
  return formatAmountInput(String(n), maxDecimals);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Format a datetime-local string (e.g. "2026-04-05T15:00") for display. */
export function formatDateTime(value: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
