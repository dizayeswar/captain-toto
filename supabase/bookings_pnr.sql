-- Add PNR to bookings (replaces unused Debt field in the form).
-- Safe to re-run.

alter table public.bookings
  add column if not exists pnr text not null default '';
