import * as XLSX from "xlsx";

export type ExcelCell = string | number | boolean | null | undefined;

/** Build sheet rows from labeled column getters (run on the server). */
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

/** Download one or more sheets as a .xlsx file (browser only). */
export function downloadExcel(
  filename: string,
  sheets: { name: string; rows: Record<string, ExcelCell>[] }[]
): void {
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
