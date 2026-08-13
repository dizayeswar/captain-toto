import { requireRole } from "@/lib/auth";
import { createExpenseAction } from "@/lib/actions";
import { getExpensePaidByOptions } from "@/lib/staffNames";
import { PageHeader } from "@/components/ui";
import ExpenseForm from "@/components/ExpenseForm";

export const dynamic = "force-dynamic";

export default async function NewExpensePage() {
  await requireRole(["ceo", "admin"]);
  const paidByOptions = await getExpensePaidByOptions();
  return (
    <>
      <PageHeader
        title="New Expense"
        subtitle="Record a daily operating expense"
      />
      <div className="p-8">
        <ExpenseForm
          action={createExpenseAction}
          paidByOptions={paidByOptions}
          submitLabel="Create Expense"
        />
      </div>
    </>
  );
}
