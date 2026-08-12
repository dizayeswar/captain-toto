import { requireRole } from "@/lib/auth";
import { PageHeader, Card } from "@/components/ui";
import ResetDataForm from "@/components/ResetDataForm";

export const dynamic = "force-dynamic";

export default async function ResetDataPage() {
  await requireRole(["ceo"]);

  return (
    <>
      <PageHeader
        title="Reset Data"
        subtitle="Permanently erase all bookings, invoices, finance, and related records"
      />
      <div className="mx-auto max-w-lg px-8 py-8">
        <Card className="border-red-200 p-6 dark:border-red-900/60">
          <h2 className="text-base font-semibold text-red-700 dark:text-red-400">
            Danger zone
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            This deletes all operational data: bookings, ticket/payment invoices,
            hotels, visas, suppliers, expenses, deposits, recycle bin, and airline
            policies. Login accounts and user roles are kept.
          </p>
          <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">
            This cannot be undone.
          </p>
          <div className="mt-6">
            <ResetDataForm />
          </div>
        </Card>
      </div>
    </>
  );
}
