/** Trailing digits from codes like CT-PR-0014 or CT-0002. */
export function codeNumber(code: string | null | undefined): number {
  const m = String(code ?? "").match(/(\d+)\s*$/);
  return m ? Number(m[1]) : 0;
}

/**
 * Next sequential id: PREFIX + (max existing + 1), zero-padded to 4.
 * Example: nextSequentialCode(["CT-PR-0014", "CT-PR-0002"], "CT-PR-") → "CT-PR-0015"
 */
export function nextSequentialCode(
  existing: string[],
  prefix: string
): string {
  let max = 0;
  for (const code of existing) {
    if (!code.startsWith(prefix)) continue;
    max = Math.max(max, codeNumber(code));
  }
  return `${prefix}${String(max + 1).padStart(4, "0")}`;
}

/** Newest / highest code first (works with zero-padded ids). */
export function sortByCodeDesc<T>(
  rows: T[],
  codeOf: (row: T) => string | null | undefined
): T[] {
  return [...rows].sort(
    (a, b) => codeNumber(codeOf(b)) - codeNumber(codeOf(a))
  );
}

/** Newest date first; higher code wins ties. */
export function sortByDateThenCodeDesc<T>(
  rows: T[],
  dateOf: (row: T) => string | null | undefined,
  codeOf: (row: T) => string | null | undefined
): T[] {
  return [...rows].sort((a, b) => {
    const d = String(dateOf(b) ?? "").localeCompare(String(dateOf(a) ?? ""));
    if (d !== 0) return d;
    return codeNumber(codeOf(b)) - codeNumber(codeOf(a));
  });
}
