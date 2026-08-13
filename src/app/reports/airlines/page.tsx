import { getBookings, groupByKeys, BOOKING_REPORT_SELECT } from "@/lib/bookings";
import { groupRowsToExcel } from "@/lib/excelRows";
import { AIRLINES } from "@/lib/lists";
import { PageHeader } from "@/components/ui";
import GroupReport from "@/components/GroupReport";
import ExportExcelButton from "@/components/ExportExcelButton";

export const dynamic = "force-dynamic";

export default async function AirlineReportPage() {
  const bookings = await getBookings(BOOKING_REPORT_SELECT);
  const rows = groupByKeys(bookings, (b) => b.airline, AIRLINES);

  return (
    <>
      <PageHeader
        title="Airline Analysis"
        subtitle="Bookings, revenue and profit per airline"
        action={
          <ExportExcelButton
            filename="airline-analysis"
            sheetName="Airlines"
            rows={groupRowsToExcel(rows, "Airline")}
          />
        }
      />
      <div className="p-8">
        <GroupReport
          keyHeader="Airline"
          rows={rows}
          columns={["bookings", "revenue", "profit"]}
        />
      </div>
    </>
  );
}
