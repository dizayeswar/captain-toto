import { getBookings } from "@/lib/bookings";
import { createInvoiceAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import InvoiceForm, { type BookingOption } from "@/components/InvoiceForm";

export const dynamic = "force-dynamic";

export default async function NewInvoicePage() {
  const bookings = await getBookings();
  const options: BookingOption[] = bookings.map((b) => ({
    booking_id: b.booking_id,
    client_name: b.client_name,
    airline: b.airline,
  }));

  return (
    <>
      <PageHeader
        title="New Ticket Invoice"
        subtitle="Enter invoice details, passengers and flight segments"
      />
      <div className="p-8">
        <InvoiceForm
          action={createInvoiceAction}
          bookings={options}
          submitLabel="Create Invoice"
        />
      </div>
    </>
  );
}
