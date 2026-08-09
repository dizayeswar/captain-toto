import { createHotelBookingAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import HotelForm from "@/components/HotelForm";

export const dynamic = "force-dynamic";

export default function NewHotelBookingPage() {
  return (
    <>
      <PageHeader
        title="New Hotel Booking"
        subtitle="Enter the details of a new hotel reservation"
      />
      <div className="p-8">
        <HotelForm
          action={createHotelBookingAction}
          submitLabel="Create Booking"
        />
      </div>
    </>
  );
}
