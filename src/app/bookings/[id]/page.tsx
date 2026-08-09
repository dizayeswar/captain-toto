import { notFound } from "next/navigation";
import { getBooking } from "@/lib/bookings";
import { updateBookingAction } from "@/lib/actions";
import { PageHeader, Button } from "@/components/ui";
import BookingForm from "@/components/BookingForm";

export const dynamic = "force-dynamic";

export default async function EditBookingPage(props: PageProps<"/bookings/[id]">) {
  const { id } = await props.params;
  const booking = await getBooking(id);
  if (!booking) notFound();

  const action = updateBookingAction.bind(null, booking.id);

  return (
    <>
      <PageHeader
        title={`Edit ${booking.booking_id}`}
        subtitle="Update the details of this booking"
        action={
          <Button
            href={`/payments/new?booking=${encodeURIComponent(
              booking.booking_id
            )}`}
            variant="secondary"
          >
            + Payment Invoice
          </Button>
        }
      />
      <div className="p-8">
        <BookingForm
          action={action}
          booking={booking}
          submitLabel="Save Changes"
        />
      </div>
    </>
  );
}
