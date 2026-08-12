import { requireRole } from "@/lib/auth";
import { createExpenseAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import ExpenseForm from "@/components/ExpenseForm";

export const dynamic = "force-dynamic";

export default async function NewExpensePage() {
  await requireRole(["ceo", "admin"]);
  return (
    <>
      <PageHeader
        title="New Expense"
        subtitle="Record a daily operating expense"
      />
      <div className="p-8">
        <ExpenseForm
          action={createExpenseAction}
          submitLabel="Create Expense"
        />
      </div>
    </>
  );
}
