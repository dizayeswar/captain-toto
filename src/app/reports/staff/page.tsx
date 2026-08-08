import { getBookings, groupByKeys } from "@/lib/bookings";
import { STAFF } from "@/lib/lists";
import { PageHeader } from "@/components/ui";
import GroupReport from "@/components/GroupReport";

export const dynamic = "force-dynamic";

export default async function StaffReportPage() {
  const bookings = await getBookings();
  const rows = groupByKeys(bookings, (b) => b.handled_by, STAFF);

  return (
    <>
      <PageHeader
        title="Staff Performance"
        subtitle="Bookings and revenue handled by each staff member"
      />
      <div className="p-8">
        <GroupReport keyHeader="Handled By" rows={rows} />
      </div>
    </>
  );
}
