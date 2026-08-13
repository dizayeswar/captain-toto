import { getBookings, monthlySummary, BOOKING_REPORT_SELECT } from "@/lib/bookings";
import { groupRowsToExcel } from "@/lib/excelRows";
import { PageHeader } from "@/components/ui";
import GroupReport from "@/components/GroupReport";
import ExportExcelButton from "@/components/ExportExcelButton";

export const dynamic = "force-dynamic";

export default async function MonthlyReportPage() {
  const bookings = await getBookings(BOOKING_REPORT_SELECT);
  const rows = monthlySummary(bookings);

  return (
    <>
      <PageHeader
        title="Monthly Summary"
        subtitle="Bookings, revenue and profit for each month"
        action={
          <ExportExcelButton
            filename="monthly-summary"
            sheetName="Monthly"
            rows={groupRowsToExcel(rows, "Month")}
          />
        }
      />
      <div className="p-8">
        <GroupReport keyHeader="Month" rows={rows} />
      </div>
    </>
  );
}
