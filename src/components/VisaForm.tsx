"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CURRENCIES,
  DOCUMENT_RESULTS,
  ENTRY_TYPES,
  VISA_CASE_STATUSES,
  VISA_PAYMENT_STATUSES,
  VISA_PRIORITIES,
  VISA_STAFF,
  VISA_TYPES,
  YES_NO,
} from "@/lib/lists";
import { formatCurrency } from "@/lib/format";
import type { VisaCase } from "@/lib/types";
import { Card, Button } from "./ui";
import AmountInput from "./AmountInput";
import type { SupplierOption } from "./BookingForm";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  visa?: VisaCase;
  suppliers?: SupplierOption[];
  submitLabel?: string;
};

const labelCls = "mb-1 block text-xs font-medium text-slate-600";
const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function VisaForm({
  action,
  visa,
  suppliers = [],
  submitLabel = "Save Case",
}: Props) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [supplierName, setSupplierName] = useState(
    visa?.supplier_name || suppliers[0]?.name || ""
  );
  const [appointmentFee, setAppointmentFee] = useState(
    visa?.appointment_fee ?? 0
  );
  const [documentFee, setDocumentFee] = useState(visa?.document_fee ?? 0);
  const [extraCharges, setExtraCharges] = useState(visa?.extra_charges ?? 0);
  const [amountPaid, setAmountPaid] = useState(visa?.amount_paid_usd ?? 0);

  const supplierCode =
    suppliers.find((s) => s.name === supplierName)?.code ??
    visa?.supplier_code ??
    "";

  const totalSale =
    (Number(appointmentFee) || 0) +
    (Number(documentFee) || 0) +
    (Number(extraCharges) || 0);
  const balance = totalSale - (Number(amountPaid) || 0);

  return (
    <form action={action}>
      <Card className="p-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelCls}>Created Date *</label>
            <input
              type="date"
              name="created_date"
              required
              defaultValue={visa?.created_date ?? today}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Client Name *</label>
            <input
              type="text"
              name="client_name"
              required
              defaultValue={visa?.client_name ?? ""}
              placeholder="Full name"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Phone</label>
            <input
              type="text"
              name="phone"
              defaultValue={visa?.phone ?? ""}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Email</label>
            <input
              type="email"
              name="email"
              defaultValue={visa?.email ?? ""}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Passport No.</label>
            <input
              type="text"
              name="passport_no"
              defaultValue={visa?.passport_no ?? ""}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Nationality</label>
            <input
              type="text"
              name="nationality"
              defaultValue={visa?.nationality ?? ""}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Destination Country</label>
            <input
              type="text"
              name="destination_country"
              defaultValue={visa?.destination_country ?? ""}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Visa Type</label>
            <select
              name="visa_type"
              defaultValue={visa?.visa_type ?? VISA_TYPES[0]}
              className={inputCls}
            >
              {VISA_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Entry Type</label>
            <select
              name="entry_type"
              defaultValue={visa?.entry_type ?? ENTRY_TYPES[0]}
              className={inputCls}
            >
              {ENTRY_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Travel Date</label>
            <input
              type="date"
              name="travel_date"
              defaultValue={visa?.travel_date ?? ""}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Application Date</label>
            <input
              type="date"
              name="application_date"
              defaultValue={visa?.application_date ?? ""}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Appointment Date</label>
            <input
              type="date"
              name="appointment_date"
              defaultValue={visa?.appointment_date ?? ""}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Decision Date</label>
            <input
              type="date"
              name="decision_date"
              defaultValue={visa?.decision_date ?? ""}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Case Status</label>
            <select
              name="case_status"
              defaultValue={visa?.case_status ?? VISA_CASE_STATUSES[0]}
              className={inputCls}
            >
              {VISA_CASE_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Priority</label>
            <select
              name="priority"
              defaultValue={visa?.priority ?? VISA_PRIORITIES[0]}
              className={inputCls}
            >
              {VISA_PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Staff</label>
            <select
              name="staff"
              defaultValue={visa?.staff ?? VISA_STAFF[0]}
              className={inputCls}
            >
              {VISA_STAFF.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Currency</label>
            <select
              name="currency"
              defaultValue={visa?.currency ?? CURRENCIES[0]}
              className={inputCls}
            >
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Appointment Fee</label>
            <AmountInput
              name="appointment_fee"
              value={appointmentFee}
              onChange={setAppointmentFee}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Document Fee</label>
            <AmountInput
              name="document_fee"
              value={documentFee}
              onChange={setDocumentFee}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Extra Charges</label>
            <AmountInput
              name="extra_charges"
              value={extraCharges}
              onChange={setExtraCharges}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Amount Paid (USD)</label>
            <AmountInput
              name="amount_paid_usd"
              value={amountPaid}
              onChange={setAmountPaid}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Payment Status</label>
            <select
              name="payment_status"
              defaultValue={visa?.payment_status ?? VISA_PAYMENT_STATUSES[2]}
              className={inputCls}
            >
              {VISA_PAYMENT_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Documents Result</label>
            <select
              name="documents_result"
              defaultValue={visa?.documents_result ?? DOCUMENT_RESULTS[2]}
              className={inputCls}
            >
              {DOCUMENT_RESULTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Passport Received</label>
            <select
              name="passport_received"
              defaultValue={visa?.passport_received ?? YES_NO[1]}
              className={inputCls}
            >
              {YES_NO.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Passport Returned</label>
            <select
              name="passport_returned"
              defaultValue={visa?.passport_returned ?? YES_NO[1]}
              className={inputCls}
            >
              {YES_NO.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Provider</label>
            <input
              type="text"
              name="provider"
              defaultValue={visa?.provider ?? ""}
              placeholder="e.g. VFS GLOBAL"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Provider Reference</label>
            <input
              type="text"
              name="provider_reference"
              defaultValue={visa?.provider_reference ?? ""}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Supplier</label>
            <select
              name="supplier_name"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className={inputCls}
            >
              {suppliers.length === 0 ? (
                <option value="">No suppliers — add in Suppliers Directory</option>
              ) : (
                suppliers.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name}
                  </option>
                ))
              )}
            </select>
            <input type="hidden" name="supplier_code" value={supplierCode} />
            <p className="mt-1 text-xs text-slate-400">Code: {supplierCode || "—"}</p>
          </div>

          <div className="lg:col-span-3">
            <label className={labelCls}>Notes</label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={visa?.notes ?? ""}
              className={inputCls}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Total Sale (auto)
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatCurrency(totalSale)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Balance (auto)
            </p>
            <p
              className={`mt-1 text-2xl font-bold ${
                balance > 0 ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {formatCurrency(balance)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button type="submit" variant="primary">
            {submitLabel}
          </Button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </Card>
    </form>
  );
}
