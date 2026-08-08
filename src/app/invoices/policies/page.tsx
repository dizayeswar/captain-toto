import { getAirlinePolicies } from "@/lib/invoices";
import { updatePolicyAction } from "@/lib/actions";
import { PageHeader, Card, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function PoliciesPage() {
  const policies = await getAirlinePolicies();

  return (
    <>
      <PageHeader
        title="Airline Policies"
        subtitle="The fare & conditions text printed at the bottom of each invoice"
      />
      <div className="p-8">
        {policies.length === 0 ? (
          <EmptyState message="No policies yet." />
        ) : (
          <div className="space-y-4">
            {policies.map((p) => (
              <Card key={p.airline} className="p-5">
                <form action={updatePolicyAction}>
                  <input type="hidden" name="airline" value={p.airline} />
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-900">
                      {p.airline}
                    </h2>
                    <button
                      type="submit"
                      className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
                    >
                      Save
                    </button>
                  </div>
                  <textarea
                    name="policy_text"
                    defaultValue={p.policy_text}
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </form>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
