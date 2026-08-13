import { notFound } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getFinanceDeposit } from "@/lib/financeBalance";
import { getBroughtByOptions } from "@/lib/staffNames";
import { updateFinanceDepositAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import FinanceDepositForm from "@/components/FinanceDepositForm";

export const dynamic = "force-dynamic";

export default async function EditFinanceDepositPage(props: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["ceo", "admin"]);
  const { id } = await props.params;
  const [deposit, broughtByOptions] = await Promise.all([
    getFinanceDeposit(id),
    getBroughtByOptions(),
  ]);
  if (!deposit) notFound();

  const action = updateFinanceDepositAction.bind(null, deposit.id);

  return (
    <>
      <PageHeader
        title="Edit deposit"
        subtitle={`${deposit.brought_by || "—"} · ${deposit.amount} ${deposit.currency}`}
        action={
          <Link
            href="/finance"
            className="text-sm font-medium text-brand hover:underline"
          >
            ← Back to Finance
          </Link>
        }
      />
      <div className="p-8">
        <FinanceDepositForm
          action={action}
          deposit={deposit}
          broughtByOptions={
            deposit.brought_by &&
            !broughtByOptions.includes(deposit.brought_by)
              ? [...broughtByOptions, deposit.brought_by]
              : broughtByOptions
          }
          submitLabel="Save changes"
        />
      </div>
    </>
  );
}
