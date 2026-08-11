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
        title="Bookings"
        subtitle="All flight bookings entered into the system"
        action={
          <div className="flex items-center gap-3">
            <ExportExcelButton
              filename="bookings"
              sheetName="Bookings"
              rows={bookingsToExcel(bookings)}
            />
            <Button href="/bookings/new">+ New Booking</Button>
          </div>
        }
      />
      <div className="p-8">
        <BookingsTable bookings={bookings} />
      </div>
    </>
  );
}
