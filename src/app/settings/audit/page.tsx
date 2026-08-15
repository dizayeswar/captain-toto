import { requireRole, canViewAuditLog } from "@/lib/auth";
import { listAuditLogs } from "@/lib/auditLog";
import { PageHeader, EmptyState } from "@/components/ui";
import AuditLogTable from "@/components/AuditLogTable";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AuditLogPage() {
  const profile = await requireRole(["ceo", "admin"]);
  if (!canViewAuditLog(profile.role)) redirect("/");

  const logs = await listAuditLogs();

  return (
    <>
      <PageHeader
        title="Audit log"
        subtitle="Who created, updated, or deleted records in Captain ToTo"
      />
      <div className="p-8">
        {logs.length === 0 ? (
          <EmptyState message="No audit entries yet. They appear as staff create or change records." />
        ) : (
          <AuditLogTable logs={logs} />
        )}
      </div>
    </>
  );
}
