"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CURRENCIES,
  HOTEL_BOOKING_STATUSES,
  HOTEL_PAYMENT_STATUSES,
  MEAL_PLANS,
  ROOM_TYPES,
  STAFF,
  SUPPLIERS,
} from "@/lib/lists";
import { formatCurrency } from "@/lib/format";
import type { HotelBooking } from "@/lib/types";
import { Card, Button } from "./ui";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  booking?: HotelBooking;
  submitLabel?: string;
};

const labelCls = "mb-1 block text-xs font-medium text-slate-600";
const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
  const days = Math.round((b.getTime() - a.getTime()) / 86400000);
  return days > 0 ? days : 0;
}

export default function HotelForm({
  action,
  booking,
  submitLabel = "Save Hotel Booking",
}: Props) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [checkIn, setCheckIn] = useState(booking?.check_in ?? "");
  const [checkOut, setCheckOut] = useState(booking?.check_out ?? "");
  const [nightsInput, setNightsInput] = useState(
    booking?.nights ? String(booking.nights) : ""
  );
  const [rooms, setRooms] = useState(booking?.rooms ?? 1);
  const [costPerNight, setCostPerNight] = useState(
    booking?.cost_per_room_night ?? 0
  );
  const [salePerNight, setSalePerNight] = useState(
    booking?.sale_per_room_night ?? 0
  );
  const [extraCost, setExtraCost] = useState(booking?.extra_cost ?? 0);
  const [discount, setDiscount] = useState(booking?.discount ?? 0);
  const [netPaid, setNetPaid] = useState(booking?.net_paid_usd ?? 0);

  const computedNights = nightsBetween(checkIn, checkOut);
  const nights =
    nightsInput.trim() === "" ? computedNights : Number(nightsInput) || 0;
  const roomsN = Number(rooms) || 1;
  const totalCost =
    roomsN * nights * (Number(costPerNight) || 0) +
    (Number(extraCost) || 0) -
    (Number(discount) || 0);
  const totalSale = roomsN * nights * (Number(salePerNight) || 0);
  const profit = totalSale - totalCost;
  const balance = totalSale - (Number(netPaid) || 0);

  return (
    <form action={action} className="space-y-6">
      {/* Guest */}
      <Card className="p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Guest
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelCls}>Lead Guest *</label>
            <input
              type="text"
              name="lead_guest"
              required
              dir="auto"
              defaultValue={booking?.lead_guest ?? ""}
              placeholder="Full name"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input
              type="text"
              name="phone"
              defaultValue={booking?.phone ?? ""}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input
              type="email"
              name="email"
              defaultValue={booking?.email ?? ""}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Nationality</label>
            <input
              type="text"
              name="nationality"
              defaultValue={booking?.nationality ?? ""}
              className={inputCls}
            />
          </div>
        </div>
      </Card>

      {/* Stay */}
      <Card className="p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Stay
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelCls}>Destination Country</label>
            <input
              type="text"
              name="destination_country"
              defaultValue={booking?.destination_country ?? ""}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>City</label>
            <input
              type="text"
              name="city"
              defaultValue={booking?.city ?? ""}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Hotel Name *</label>
            <input
              type="text"
              name="hotel_name"
              required
              defaultValue={booking?.hotel_name ?? ""}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Hotel Confirmation No.</label>
            <input
              type="text"
              name="hotel_confirmation_no"
              defaultValue={booking?.hotel_confirmation_no ?? ""}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Check-in</label>
            <input
              type="date"
              name="check_in"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Check-out</label>
            <input
              type="date"
              name="check_out"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>
              Nights
              {nightsInput.trim() === "" && computedNights > 0 && (
                <span className="ml-1 font-normal text-slate-400">
                  (auto)
                </span>
              )}
            </label>
            <input
              type="number"
              name="nights"
              min={0}
              value={nightsInput.trim() === "" ? computedNights || "" : nightsInput}
              onChange={(e) => setNightsInput(e.target.value)}
              placeholder={computedNights ? String(computedNights) : "0"}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Rooms</label>
            <input
              type="number"
              name="rooms"
              min={1}
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Adults</label>
            <input
              type="number"
              name="adults"
              min={0}
              defaultValue={booking?.adults ?? 1}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Children</label>
            <input
              type="number"
              name="children"
              min={0}
              defaultValue={booking?.children ?? 0}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Infants</label>
            <input
              type="number"
              name="infants"
              min={0}
              defaultValue={booking?.infants ?? 0}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Room Type</label>
            <select
              name="room_type"
              defaultValue={booking?.room_type ?? ROOM_TYPES[0]}
              className={inputCls}
            >
              {ROOM_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Meal Plan</label>
            <select
              name="meal_plan"
              defaultValue={booking?.meal_plan ?? MEAL_PLANS[0]}
              className={inputCls}
            >
              {MEAL_PLANS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Supplier</label>
            <select
              name="supplier"
              defaultValue={booking?.supplier ?? SUPPLIERS[0]?.name ?? ""}
              className={inputCls}
            >
              {SUPPLIERS.map((s) => (
                <option key={s.code} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Pricing */}
      <Card className="p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Pricing
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelCls}>Currency</label>
            <select
              name="currency"
              defaultValue={booking?.currency ?? CURRENCIES[0]}
              className={inputCls}
            >
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Cost / Room / Night ($)</label>
            <input
              type="number"
              name="cost_per_room_night"
              min={0}
              step="0.01"
              value={costPerNight}
              onChange={(e) => setCostPerNight(Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Sale / Room / Night ($)</label>
            <input
              type="number"
              name="sale_per_room_night"
              min={0}
              step="0.01"
              value={salePerNight}
              onChange={(e) => setSalePerNight(Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Extra Cost ($)</label>
            <input
              type="number"
              name="extra_cost"
              min={0}
              step="0.01"
              value={extraCost}
              onChange={(e) => setExtraCost(Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Discount ($)</label>
            <input
              type="number"
              name="discount"
              min={0}
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Net Paid ($)</label>
            <input
              type="number"
              name="net_paid_usd"
              min={0}
              step="0.01"
              value={netPaid}
              onChange={(e) => setNetPaid(Number(e.target.value))}
              className={inputCls}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Total Cost
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatCurrency(totalCost)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Total Sale
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatCurrency(totalSale)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Profit
            </p>
            <p
              className={`mt-1 text-xl font-bold ${
                profit >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {formatCurrency(profit)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Balance
            </p>
            <p
              className={`mt-1 text-xl font-bold ${
                balance > 0 ? "text-amber-600" : "text-slate-900"
              }`}
            >
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </Card>

      {/* Status */}
      <Card className="p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Status
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelCls}>Created Date *</label>
            <input
              type="date"
              name="created_date"
              required
              defaultValue={booking?.created_date ?? today}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Booking Status</label>
            <select
              name="booking_status"
              defaultValue={booking?.booking_status ?? HOTEL_BOOKING_STATUSES[0]}
              className={inputCls}
            >
              {HOTEL_BOOKING_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Payment Status</label>
            <select
              name="payment_status"
              defaultValue={
                booking?.payment_status ?? HOTEL_PAYMENT_STATUSES[2]
              }
              className={inputCls}
            >
              {HOTEL_PAYMENT_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Staff</label>
            <select
              name="staff"
              defaultValue={booking?.staff ?? STAFF[0]}
              className={inputCls}
            >
              {STAFF.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className={labelCls}>Notes</label>
            <input
              type="text"
              name="notes"
              dir="auto"
              defaultValue={booking?.notes ?? ""}
              className={inputCls}
            />
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
