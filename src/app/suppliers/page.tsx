import { getSuppliers } from "@/lib/supplierFinance";
import {
  createSupplierAction,
  deleteSupplierAction,
} from "@/lib/actions";
import { CURRENCIES, SUPPLIER_TYPES } from "@/lib/lists";
import { PageHeader, Button, Card, EmptyState } from "@/components/ui";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

const labelCls = "mb-1 block text-xs font-medium text-slate-600";
const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <>
      <PageHeader
        title="Suppliers"
        subtitle="Directory of suppliers used across supplier finance"
      />
      <div className="space-y-8 p-8">
        <Card className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">
            Add supplier
          </h2>
          <form action={createSupplierAction}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className={labelCls}>Name *</label>
                <input
                  name="name"
                  required
                  className={inputCls}
                  placeholder="Supplier name"
                />
              </div>
              <div>
                <label className={labelCls}>Type</label>
                <select
                  name="supplier_type"
                  defaultValue={SUPPLIER_TYPES[0]}
                  className={inputCls}
                >
                  {SUPPLIER_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Country</label>
                <input name="country" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>City</label>
                <input name="city" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input name="phone" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input name="email" type="email" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Currency</label>
                <select
                  name="currency"
                  defaultValue="USD"
                  className={inputCls}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button type="submit" variant="primary">
                  Add Supplier
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {suppliers.length === 0 ? (
          <EmptyState message="No suppliers yet. Add your first one above." />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3 font-semibold">Code</th>
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Type</th>
                    <th className="px-5 py-3 font-semibold">Location</th>
                    <th className="px-5 py-3 font-semibold">Phone</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Currency</th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {suppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {s.supplier_code}
                      </td>
                      <td className="px-5 py-3 text-slate-800" dir="auto">
                        {s.name}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {s.supplier_type || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {[s.city, s.country].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {s.phone || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {s.email || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {s.currency || "—"}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end">
                          <DeleteButton
                            action={deleteSupplierAction}
                            id={s.id}
                            confirmMessage={`Delete supplier ${s.name}?`}
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
