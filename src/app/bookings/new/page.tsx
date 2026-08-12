import { createBookingAction } from "@/lib/actions";
import { getSupplierOptions } from "@/lib/suppliers";
import { PageHeader } from "@/components/ui";
import BookingForm from "@/components/BookingForm";

export const dynamic = "force-dynamic";

export default async function NewBookingPage() {
  const suppliers = await getSupplierOptions();

  return (
    <>
      <PageHeader
        title="New Ticket booking"
        subtitle="Enter the details of a new flight ticket booking"
      />
      <div className="p-8">
        <BookingForm
          action={createBookingAction}
          suppliers={suppliers}
          submitLabel="Create Ticket booking"
        />
      </div>
    </>
  );
}
