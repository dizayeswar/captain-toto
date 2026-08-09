import { notFound } from "next/navigation";
import { getExpense } from "@/lib/expenses";
import { updateExpenseAction } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import ExpenseForm from "@/components/ExpenseForm";

export const dynamic = "force-dynamic";

export default async function EditExpensePage(
  props: PageProps<"/finance/[id]">
) {
  const { id } = await props.params;
  const expense = await getExpense(id);
  if (!expense) notFound();

  const action = updateExpenseAction.bind(null, expense.id);

  return (
    <>
      <PageHeader
        title="Edit Expense"
        subtitle={expense.description || "Update this expense"}
      />
      <div className="p-8">
        <ExpenseForm
          action={action}
          expense={expense}
          submitLabel="Save Changes"
        />
      </div>
    </>
  );
}
