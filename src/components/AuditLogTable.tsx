"use client";

import {
  AUDIT_ACTION_LABELS,
  AUDIT_ENTITY_LABELS,
  type AuditAction,
  type AuditLog,
} from "@/lib/auditLogShared";
import { formatDateTime } from "@/lib/format";
import FilterableList from "./FilterableList";
import { Card } from "./ui";

const ACTION_OPTIONS = (
  Object.keys(AUDIT_ACTION_LABELS) as AuditAction[]
).map((a) => ({ value: a, label: AUDIT_ACTION_LABELS[a] }));

export default function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  return (
    <FilterableList
      items={logs}
      searchPlaceholder="Search by who, what, summary…"
      searchText={(row) =>
        `${row.actor_name} ${row.action} ${row.entity_type} ${row.summary} ${row.entity_id}`
      }
      statusOptions={ACTION_OPTIONS}
      statusValue={(row) => row.action}
      itemDate={(row) => row.created_at}
      emptyMessage="No audit entries match your filters."
    >
      {(rows) => (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  <th className="px-5 py-3 font-semibold">When</th>
                  <th className="px-5 py-3 font-semibold">Who</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <td className="whitespace-nowrap px-5 py-3 text-slate-600 dark:text-slate-400">
                      {formatDateTime(row.created_at)}
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {row.actor_name || "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                      {AUDIT_ACTION_LABELS[row.action] ?? row.action}
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-400">
                      {AUDIT_ENTITY_LABELS[row.entity_type] ?? row.entity_type}
                    </td>
                    <td className="px-5 py-3 text-slate-800 dark:text-slate-200" dir="auto">
                      {row.summary || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </FilterableList>
  );
}
