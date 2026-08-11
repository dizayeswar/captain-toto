-- Hotel cancel: service fee (client) + cancel/ticket cost (supplier)
-- Safe to re-run.

alter table public.hotel_bookings
  add column if not exists service_fee_usd numeric not null default 0;

alter table public.hotel_bookings
  add column if not exists cancel_cost_usd numeric not null default 0;
