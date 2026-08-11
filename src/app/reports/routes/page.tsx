import { getBookings, groupByKeys } from "@/lib/bookings";
import { groupRowsToExcel } from "@/lib/excelRows";
import { ROUTES } from "@/lib/lists";
import { PageHeader } from "@/components/ui";
import GroupReport from "@/components/GroupReport";
import ExportExcelButton from "@/components/ExportExcelButton";

export const dynamic = "force-dynamic";

export default async function RouteReportPage() {
  const bookings = await getBookings();
  const rows = groupByKeys(bookings, (b) => b.route, ROUTES);

  return (
    <>
      <PageHeader
        title="Route Analysis"
        subtitle="Bookings, revenue and profit per route"
        action={
          <ExportExcelButton
            filename="route-analysis"
            sheetName="Routes"
            rows={groupRowsToExcel(rows, "Route")}
          />
        }
      />
      <div className="p-8">
        <GroupReport
          keyHeader="Route"
          rows={rows}
          columns={["bookings", "revenue", "profit"]}
        />
      </div>
    </>
  );
}
