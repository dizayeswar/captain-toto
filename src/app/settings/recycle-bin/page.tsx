import {
  listRecycleBin,
  RECYCLE_ENTITY_LABELS,
  type RecycleEntityType,
} from "@/lib/recycleBin";
import {
  restoreRecycleBinItemAction,
  purgeRecycleBinItemAction,
} from "@/lib/actions";
import { formatDateTime } from "@/lib/format";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

function RestoreButton({ id, label }: { id: string; label: string }) {
  return (
    <form action={restoreRecycleBinItemAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="font-medium text-brand hover:underline dark:text-sky-300"
      >
        {label}
      </button>
    </form>
  );
}

export default async function RecycleBinPage() {
  const items = await listRecycleBin();

  return (
    <>
      <PageHeader
        title="Recycle Bin"
        subtitle="Deleted items stay here until you restore or permanently delete them"
      />
      <div className="px-8 py-8">
        {items.length === 0 ? (
          <EmptyState message="Recycle bin is empty." />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Type</th>
                    <th className="px-5 py-3 font-semibold">Item</th>
                    <th className="px-5 py-3 font-semibold">Deleted</th>
                    <th className="px-5 py-3 font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <td className="whitespace-nowrap px-5 py-3 text-slate-600 dark:text-slate-300">
                        {RECYCLE_ENTITY_LABELS[
                          item.entity_type as RecycleEntityType
                        ] ?? item.entity_type}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                        {item.label || "—"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-slate-500 dark:text-slate-400">
                        {formatDateTime(item.deleted_at)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-4">
                          <RestoreButton id={item.id} label="Restore" />
                          <DeleteButton
                            action={purgeRecycleBinItemAction}
                            id={item.id}
                            label="Delete forever"
                            confirmMessage={`Permanently delete "${item.label}"? This cannot be undone.`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
