import { formatCurrency } from "@/lib/format";
import type { GroupRow } from "@/lib/bookings";
import { Card, EmptyState } from "./ui";

type Col = "bookings" | "revenue" | "profit" | "pending" | "issued";

const HEADERS: Record<Col, string> = {
  bookings: "Bookings",
  revenue: "Revenue",
  profit: "Profit",
  pending: "Pending",
  issued: "Issued",
};

export default function GroupReport({
  keyHeader,
  rows,
  columns = ["bookings", "revenue", "profit", "pending", "issued"],
  hideEmptyRows = false,
}: {
  keyHeader: string;
  rows: GroupRow[];
  columns?: Col[];
  hideEmptyRows?: boolean;
}) {
  const visible = hideEmptyRows ? rows.filter((r) => r.bookings > 0) : rows;

  if (visible.length === 0) {
    return <EmptyState message="No data yet. Add a booking to see this report." />;
  }

  const totals = visible.reduce(
    (acc, r) => {
      acc.bookings += r.bookings;
      acc.revenue += r.revenue;
      acc.profit += r.profit;
      acc.pending += r.pending;
      acc.issued += r.issued;
      return acc;
    },
    { bookings: 0, revenue: 0, profit: 0, pending: 0, issued: 0 }
  );

  const cell = (col: Col, row: GroupRow) => {
    const v = row[col];
    if (col === "revenue" || col === "profit") return formatCurrency(v);
    return v;
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 font-semibold">{keyHeader}</th>
              {columns.map((c) => (
                <th key={c} className="px-5 py-3 text-right font-semibold">
                  {HEADERS[c]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((row) => (
              <tr key={row.key} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-800">
                  {row.key}
                </td>
                {columns.map((c) => (
                  <td
                    key={c}
                    className="px-5 py-3 text-right tabular-nums text-slate-700"
                  >
                    {cell(c, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold text-slate-900">
              <td className="px-5 py-3">Total</td>
              {columns.map((c) => (
                <td key={c} className="px-5 py-3 text-right tabular-nums">
                  {c === "revenue" || c === "profit"
                    ? formatCurrency(totals[c])
                    : totals[c]}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}
