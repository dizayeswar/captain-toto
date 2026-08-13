import type { ExcelCell } from "./excelTypes";

export type { ExcelCell } from "./excelTypes";

/** Download one or more sheets as a .xlsx file (browser only; loads xlsx on demand). */
export async function downloadExcel(
  filename: string,
  sheets: { name: string; rows: Record<string, ExcelCell>[] }[]
): Promise<void> {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  for (const sheet of sheets) {
    const ws = XLSX.utils.json_to_sheet(
      sheet.rows.length > 0 ? sheet.rows : [{ "(empty)": "" }]
    );
    XLSX.utils.book_append_sheet(wb, ws, sheet.name.slice(0, 31));
  }
  const name = filename.toLowerCase().endsWith(".xlsx")
    ? filename
    : `${filename}.xlsx`;
  XLSX.writeFile(wb, name);
}
