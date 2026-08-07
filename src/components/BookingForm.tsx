"use client";

import { useState } from "react";

type Props = {
  tourSlug: string;
  tourTitle: string;
};

type Status = "idle" | "sending" | "success" | "error";

export default function BookingForm({ tourSlug, tourTitle }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      tour_slug: tourSlug,
      tour_title: tourTitle,
      full_name: String(data.get("full_name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      travelers: Number(data.get("travelers") ?? 1),
      travel_date: String(data.get("travel_date") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Request failed");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="text-3xl">🎉</div>
        <h3 className="mt-2 text-lg font-bold text-green-800">
          Request received!
        </h3>
        <p className="mt-1 text-sm text-green-700">
          Thanks for booking <strong>{tourTitle}</strong>. Our team will contact
          you shortly to confirm the details.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          Book another
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Full name
        </label>
        <input name="full_name" required className={inputClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Phone
          </label>
          <input name="phone" required className={inputClass} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Travelers
          </label>
          <input
            name="travelers"
            type="number"
            min={1}
            defaultValue={1}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Preferred date
          </label>
          <input name="travel_date" type="date" required className={inputClass} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Message (optional)
        </label>
        <textarea name="message" rows={3} className={inputClass} />
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Request booking"}
      </button>
    </form>
  );
}
