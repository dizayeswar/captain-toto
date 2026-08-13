import type { ExcelCell } from "./excelTypes";

export type { ExcelCell } from "./excelTypes";

/** Build sheet rows from labeled column getters (no xlsx dependency). */
export function mapExcelRows<T>(
  data: T[],
  columns: { label: string; value: (row: T) => ExcelCell }[]
): Record<string, ExcelCell>[] {
  return data.map((row) => {
    const out: Record<string, ExcelCell> = {};
    for (const col of columns) {
      const v = col.value(row);
      out[col.label] = v ?? "";
    }
    return out;
  });
}
