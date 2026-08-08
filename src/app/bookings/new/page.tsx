import { createBookingAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import BookingForm from "@/components/BookingForm";

export default function NewBookingPage() {
  return (
    <>
      <PageHeader
        title="New Booking"
        subtitle="Enter the details of a new flight booking"
      />
      <div className="p-8">
        <BookingForm action={createBookingAction} submitLabel="Create Booking" />
      </div>
    </>
  );
}
