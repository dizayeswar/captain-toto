import { NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { BookingInput } from "@/lib/types";

export async function POST(request: Request) {
  let body: Partial<BookingInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const required: (keyof BookingInput)[] = [
    "tour_slug",
    "tour_title",
    "full_name",
    "email",
    "phone",
    "travel_date",
  ];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json(
        { ok: false, error: `Missing field: ${field}` },
        { status: 400 }
      );
    }
  }

  const booking: BookingInput = {
    tour_slug: String(body.tour_slug),
    tour_title: String(body.tour_title),
    full_name: String(body.full_name),
    email: String(body.email),
    phone: String(body.phone),
    travelers: Number(body.travelers) || 1,
    travel_date: String(body.travel_date),
    message: body.message ? String(body.message) : "",
  };

  // Demo mode: no Supabase yet — accept the booking so the form still works.
  if (!isSupabaseConfigured) {
    console.log("[bookings] (demo mode, not saved):", booking);
    return NextResponse.json({ ok: true, demo: true });
  }

  const supabase = getSupabase();
  const { error } = await supabase!.from("bookings").insert(booking);

  if (error) {
    console.error("[bookings] insert error:", error.message);
    return NextResponse.json(
      { ok: false, error: "Could not save booking. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
