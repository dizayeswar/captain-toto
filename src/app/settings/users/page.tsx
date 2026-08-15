import {
  canAssignRole,
  canCreateUsers,
  canDisableUsers,
  listProfiles,
  requireRole,
  ROLE_LABELS,
  type AppRole,
} from "@/lib/auth";
import {
  setUserDisabledAction,
  updateUserRoleAction,
} from "@/lib/authActions";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import CreateUserForm from "@/components/CreateUserForm";

export const dynamic = "force-dynamic";

export default async function UsersSettingsPage() {
  const actor = await requireRole(["ceo", "admin"]);
  const profiles = await listProfiles();
  const showCreate = canCreateUsers(actor.role);
  const showDisable = canDisableUsers(actor.role);
  const createRoles = (["ceo", "admin", "staff"] as AppRole[]).filter((r) =>
    canAssignRole(actor.role, r, "staff")
  );
  const activeCeoCount = profiles.filter(
    (p) => p.role === "ceo" && !p.disabled
  ).length;

  return (
    <>
      <PageHeader
        title="Users"
        subtitle={
          showCreate
            ? "Add accounts, manage roles, and disable logins."
            : "Manage account roles."
        }
      />
      <div className="space-y-8 px-8 py-8">
        {showCreate && (
          <Card className="p-6">
            <h2 className="mb-1 text-base font-semibold text-slate-900 dark:text-slate-100">
              Add user
            </h2>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
              Creates a login they can use immediately. Share the email and
              temporary password with them.
            </p>
            <CreateUserForm roles={createRoles} />
          </Card>
        )}

        {profiles.length === 0 ? (
          <EmptyState message="No users found yet." />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold text-right">
                      Change role
                    </th>
                    {showDisable && (
                      <th className="px-5 py-3 font-semibold text-right">
                        Access
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {profiles.map((user) => {
                    const isDisabled = Boolean(user.disabled);
                    const options = (
                      ["ceo", "admin", "staff"] as AppRole[]
                    ).filter(
                      (r) =>
                        canAssignRole(actor.role, r, user.role) ||
                        r === user.role
                    );
                    const canEdit =
                      user.id !== actor.id &&
                      !isDisabled &&
                      options.some((r) => r !== user.role);

                    const isSelf = user.id === actor.id;
                    const isLastCeo =
                      user.role === "ceo" &&
                      !isDisabled &&
                      activeCeoCount <= 1;
                    const canToggle =
                      showDisable && !isSelf && !(isDisabled === false && isLastCeo);

                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                          isDisabled ? "opacity-70" : ""
                        }`}
                      >
                        <td className="px-5 py-3">
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {user.full_name || "—"}
                            {isSelf ? " (you)" : ""}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {user.id.slice(0, 8)}…
                          </p>
                        </td>
                        <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                          {ROLE_LABELS[user.role]}
                        </td>
                        <td className="px-5 py-3">
                          {isDisabled ? (
                            <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                              Disabled
                            </span>
                          ) : (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                              Active
                            </span>
                          )}
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
                        {showDisable && (
                          <td className="px-5 py-3 text-right">
                            {canToggle ? (
                              <form action={setUserDisabledAction}>
                                <input
                                  type="hidden"
                                  name="id"
                                  value={user.id}
                                />
                                <input
                                  type="hidden"
                                  name="disabled"
                                  value={isDisabled ? "false" : "true"}
                                />
                                <button
                                  type="submit"
                                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                                    isDisabled
                                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                      : "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                                  }`}
                                >
                                  {isDisabled ? "Enable" : "Disable"}
                                </button>
                              </form>
                            ) : (
                              <span className="text-xs text-slate-400">
                                {isSelf
                                  ? "—"
                                  : isLastCeo
                                    ? "Last CEO"
                                    : "—"}
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {showDisable
            ? "Disable blocks login but keeps the account. You cannot disable yourself or the last CEO."
            : "Only the CEO can add or disable users. Only the CEO can assign the CEO role."}
        </p>
      </div>
    </>
  );
}
