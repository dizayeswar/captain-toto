import { getBookings } from "@/lib/bookings";
import { PageHeader, Button } from "@/components/ui";
import BookingsTable from "@/components/BookingsTable";

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <>
      <PageHeader
        title="Bookings"
        subtitle="All flight bookings entered into the system"
        action={<Button href="/bookings/new">+ New Booking</Button>}
      />
      <div className="p-8">
        <BookingsTable bookings={bookings} />
      </div>
    </>
  );
}
