import { getBookings } from "@/lib/bookings";
import { createPaymentInvoiceAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import PaymentForm, { type PaymentBookingOption } from "@/components/PaymentForm";

export const dynamic = "force-dynamic";

export default async function NewPaymentInvoicePage() {
  const bookings = await getBookings();
  const options: PaymentBookingOption[] = bookings.map((b) => ({
    booking_id: b.booking_id,
    client_name: b.client_name,
    total_paid: b.total_paid,
    route: b.route,
    airline: b.airline,
  }));

  return (
    <>
      <PageHeader
        title="New Payment Invoice"
        subtitle="Create a cash receipt for a payment received"
      />
      <div className="p-8">
        <PaymentForm
          action={createPaymentInvoiceAction}
          bookings={options}
          submitLabel="Create Payment Invoice"
        />
      </div>
    </>
  );
}
