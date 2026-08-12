import {
  canAssignRole,
  listProfiles,
  requireRole,
  ROLE_LABELS,
  type AppRole,
} from "@/lib/auth";
import { updateUserRoleAction } from "@/lib/authActions";
import { PageHeader, Card, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function UsersSettingsPage() {
  const actor = await requireRole(["ceo", "admin"]);
  const profiles = await listProfiles();

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Manage account roles. Create new users in the Supabase Dashboard."
      />
      <div className="px-8 py-8">
        {profiles.length === 0 ? (
          <EmptyState message="No users found. Create accounts in Supabase Authentication." />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3 font-semibold text-right">
                      Change role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {profiles.map((user) => {
                    const options = (["ceo", "admin", "staff"] as AppRole[]).filter(
                      (r) => canAssignRole(actor.role, r, user.role) || r === user.role
                    );
                    const canEdit =
                      user.id !== actor.id &&
                      options.some((r) => r !== user.role);

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <td className="px-5 py-3">
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {user.full_name || "—"}
                            {user.id === actor.id ? " (you)" : ""}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {user.id.slice(0, 8)}…
                          </p>
                        </td>
                        <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                          {ROLE_LABELS[user.role]}
                        </td>
                        <td className="px-5 py-3 text-right">
                          {canEdit ? (
                            <form
                              action={updateUserRoleAction}
                              className="inline-flex items-center gap-2"
                            >
                              <input type="hidden" name="id" value={user.id} />
                              <select
                                name="role"
                                defaultValue={user.role}
                                className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
                              >
                                {options.map((r) => (
                                  <option key={r} value={r}>
                                    {ROLE_LABELS[r]}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="submit"
                                className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
                              >
                                Save
                              </button>
                            </form>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          New accounts: Supabase → Authentication → Users → Add user. They start
          as Staff until you change their role here.
          {actor.role === "ceo"
            ? ""
            : " Only the CEO can assign the CEO role."}
        </p>
      </div>
    </>
  );
}
