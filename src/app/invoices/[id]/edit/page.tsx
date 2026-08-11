import { notFound } from "next/navigation";
import { getInvoice } from "@/lib/invoices";
import { getBookings } from "@/lib/bookings";
import { updateInvoiceAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import InvoiceForm, { type BookingOption } from "@/components/InvoiceForm";

export const dynamic = "force-dynamic";

export default async function EditInvoicePage(
  props: PageProps<"/invoices/[id]/edit">
) {
  const { id } = await props.params;
  const invoice = await getInvoice(id);
  if (!invoice) notFound();

  const bookings = await getBookings();
  const options: BookingOption[] = bookings.map((b) => ({
    booking_id: b.booking_id,
    client_name: b.client_name,
    airline: b.airline,
    route: b.route,
    total_paid: b.total_paid,
    pnr: b.pnr || "",
  }));

  const action = updateInvoiceAction.bind(null, invoice.id);

  return (
    <>
      <PageHeader
        title={`Edit ${invoice.invoice_no}`}
        subtitle="Update invoice details, passengers and flight segments"
      />
      <div className="p-8">
        <InvoiceForm
          action={action}
          invoice={invoice}
          bookings={options}
          submitLabel="Save Changes"
        />
      </div>
    </>
  );
}
