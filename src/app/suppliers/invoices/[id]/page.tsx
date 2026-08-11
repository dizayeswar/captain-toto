import { notFound } from "next/navigation";
import {
  getSupplierInvoice,
  getSuppliers,
} from "@/lib/supplierFinance";
import { getSupplierLinkOptions } from "@/lib/supplierLinks";
import { updateSupplierInvoiceAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import SupplierInvoiceForm from "@/components/SupplierInvoiceForm";

export const dynamic = "force-dynamic";

export default async function EditSupplierInvoicePage(
  props: PageProps<"/suppliers/invoices/[id]">
) {
  const { id } = await props.params;
  const invoice = await getSupplierInvoice(id);
  if (!invoice) notFound();

  const [records, linkOptions] = await Promise.all([
    getSuppliers(),
    getSupplierLinkOptions(),
  ]);
  const names = new Set<string>([
    ...records.filter((s) => s.active).map((s) => s.name),
    invoice.supplier,
  ]);
  const suppliers = [...names].filter(Boolean).sort((a, b) =>
    a.localeCompare(b)
  );

  const action = updateSupplierInvoiceAction.bind(null, invoice.id);

  return (
    <>
      <PageHeader
        title={`Edit ${invoice.invoice_id}`}
        subtitle="Update this supplier service invoice"
      />
      <div className="p-8">
        <SupplierInvoiceForm
          action={action}
          invoice={invoice}
          suppliers={suppliers}
          linkOptions={linkOptions}
          submitLabel="Save Changes"
        />
      </div>
    </>
  );
}
