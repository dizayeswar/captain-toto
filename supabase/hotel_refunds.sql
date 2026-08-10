-- Add hotel refund / cancellation fee columns (safe to re-run)
alter table public.hotel_bookings
  add column if not exists refunded_usd numeric not null default 0;
alter table public.hotel_bookings
  add column if not exists cancellation_fee_usd numeric not null default 0;
alter table public.hotel_bookings
  add column if not exists final_charge_usd numeric not null default 0;
