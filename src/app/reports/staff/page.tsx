import { getBookings, groupByKeys, BOOKING_REPORT_SELECT } from "@/lib/bookings";
import { groupRowsToExcel } from "@/lib/excelRows";
import { getStaffNames } from "@/lib/staffNames";
import { PageHeader } from "@/components/ui";
import GroupReport from "@/components/GroupReport";
import ExportExcelButton from "@/components/ExportExcelButton";

export const dynamic = "force-dynamic";

export default async function StaffReportPage() {
  const [bookings, staffNames] = await Promise.all([
    getBookings(BOOKING_REPORT_SELECT),
    getStaffNames(),
  ]);
  const rows = groupByKeys(bookings, (b) => b.handled_by, staffNames);

  return (
    <>
      <PageHeader
        title="Staff Performance"
        subtitle="Bookings and revenue handled by each staff member"
        action={
          <ExportExcelButton
            filename="staff-performance"
            sheetName="Staff"
            rows={groupRowsToExcel(rows, "Handled By")}
          />
        }
      />
      <div className="p-8">
        <GroupReport keyHeader="Handled By" rows={rows} />
      </div>
    </>
  );
}
