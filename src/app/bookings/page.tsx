import { getBookings } from "@/lib/bookings";
import { bookingsToExcel } from "@/lib/excelRows";
import { PageHeader, Button } from "@/components/ui";
import BookingsTable from "@/components/BookingsTable";
import ExportExcelButton from "@/components/ExportExcelButton";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <>
      <PageHeader
        title="Ticket bookings"
        subtitle="All flight ticket bookings entered into the system"
        action={
          <div className="flex items-center gap-3">
            <ExportExcelButton
              filename="ticket-bookings"
              sheetName="Ticket bookings"
              rows={bookingsToExcel(bookings)}
            />
            <Button href="/bookings/new">+ New Ticket booking</Button>
          </div>
        }
      />
      <div className="p-8">
        <BookingsTable bookings={bookings} />
      </div>
    </>
  );
}
