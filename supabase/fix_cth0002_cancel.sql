-- Fix cancel profit fields for cancelled hotel bookings.
-- 1) Run hotel_cancel_fees.sql first (adds columns).
-- 2) Then run this for CTH-0002 (penalty 320 + service 40, ticket cost 320 → profit 40).
-- Safe to re-run.

update public.hotel_bookings
set
  cancellation_fee_usd = 320,
  service_fee_usd = 40,
  cancel_cost_usd = 320,
  final_charge_usd = 360,
  profit_usd = 40,
  balance_usd = 360 - (coalesce(net_paid_usd, 0) - coalesce(refunded_usd, 0)),
  net_paid_usd = case
    when coalesce(net_paid_usd, 0) = 0 then 360
    else net_paid_usd
  end
where booking_code = 'CTH-0002'
  and booking_status in ('Cancelled', 'No Show');
