import Link from "next/link";
import { CURRENCIES, SUPPLIER_TYPES } from "@/lib/lists";
import type { SupplierRecord } from "@/lib/types";
import { Card, Button } from "./ui";

const labelCls = "mb-1 block text-xs font-medium text-slate-600";
const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function SupplierForm({
  action,
  supplier,
  submitLabel = "Save Supplier",
}: {
  action: (formData: FormData) => void | Promise<void>;
  supplier?: SupplierRecord;
  submitLabel?: string;
}) {
  return (
    <form action={action}>
      <Card className="p-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <label className={labelCls}>Supplier Name *</label>
            <input
              name="name"
              required
              defaultValue={supplier?.name ?? ""}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Type</label>
            <select
              name="supplier_type"
              defaultValue={supplier?.supplier_type ?? SUPPLIER_TYPES[0]}
              className={inputCls}
            >
              {SUPPLIER_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Country</label>
            <input
              name="country"
              defaultValue={supplier?.country ?? ""}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>City</label>
            <input
              name="city"
              defaultValue={supplier?.city ?? ""}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Currency</label>
            <select
              name="currency"
              defaultValue={supplier?.currency ?? CURRENCIES[0]}
              className={inputCls}
            >
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Contact Person</label>
            <input
              name="contact_person"
              defaultValue={supplier?.contact_person ?? ""}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input
              name="phone"
              defaultValue={supplier?.phone ?? ""}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input
              name="email"
              defaultValue={supplier?.email ?? ""}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Payment Terms</label>
            <input
              name="payment_terms"
              defaultValue={supplier?.payment_terms ?? ""}
              className={inputCls}
            />
          </div>
          <div className="lg:col-span-2">
            <label className={labelCls}>Bank / Payment Details</label>
            <input
              name="bank_details"
              defaultValue={supplier?.bank_details ?? ""}
              className={inputCls}
            />
          </div>
          <div className="lg:col-span-3">
            <label className={labelCls}>Notes</label>
            <input
              name="notes"
              defaultValue={supplier?.notes ?? ""}
              className={inputCls}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="active"
              defaultChecked={supplier ? supplier.active : true}
              className="h-4 w-4 rounded border-slate-300"
            />
            Active
          </label>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button type="submit" variant="primary">
            {submitLabel}
          </Button>
          <Link
            href="/suppliers"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </Card>
    </form>
  );
}
