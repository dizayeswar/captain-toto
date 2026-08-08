import { getBookings, monthlySummary } from "@/lib/bookings";
import { PageHeader } from "@/components/ui";
import GroupReport from "@/components/GroupReport";

export const dynamic = "force-dynamic";

export default async function MonthlyReportPage() {
  const bookings = await getBookings();
  const rows = monthlySummary(bookings);

  return (
    <>
      <PageHeader
        title="Monthly Summary"
        subtitle="Bookings, revenue and profit for each month"
      />
      <div className="p-8">
        <GroupReport keyHeader="Month" rows={rows} />
      </div>
    </>
  );
}
