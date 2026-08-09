import Link from "next/link";
import {
  getSupplierInvoices,
  summarizeSupplierFinance,
} from "@/lib/supplierFinance";
import { formatCurrency } from "@/lib/format";
import { PageHeader, Button, StatCard, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function SupplierFinanceDashboardPage() {
  const invoices = await getSupplierInvoices();
  const s = summarizeSupplierFinance(invoices);

  return (
    <>
      <PageHeader
        title="Supplier Finance"
        subtitle="Outstanding balances and payments to suppliers"
        action={
          <Button href="/suppliers/invoices/new">+ New Supplier Invoice</Button>
        }
      />
      <div className="space-y-8 p-8">
        {invoices.length === 0 ? (
          <EmptyState message="No supplier invoices yet. Create your first one." />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Open Invoices"
                value={String(s.openInvoices)}
                hint={`${invoices.length} total`}
              />
              <StatCard
                label="Outstanding"
                value={formatCurrency(s.outstanding)}
                tone="amber"
              />
              <StatCard
                label="Paid to Suppliers"
                value={formatCurrency(s.paidToSuppliers)}
                tone="green"
              />
              <StatCard
                label="Refunded"
                value={formatCurrency(s.refunded)}
              />
            </div>
            <p className="text-sm text-slate-500">
              View the full list on{" "}
              <Link
                href="/suppliers/invoices"
                className="font-medium text-brand hover:underline"
              >
                Supplier Invoices
              </Link>
              .
            </p>
          </>
        )}
      </div>
    </>
  );
}
