-- Captain Toto — seed data
-- Run AFTER schema.sql. Inserts one sample booking so the app has data to show.

insert into public.bookings
  (booking_id, booking_date, client_name, client_type, route, airline,
   ticket_cost, service_fee, total_paid, payment_status, issued, handled_by,
   payment_method, profit, debt, supplier_name, supplier_code, month, year)
values
  ('CT-0001', '2026-05-15', 'Cicih Kasto', 'Individual', 'EBL - CGK', 'Emirates',
   850, 15, 865, 'Paid', true, 'Osman',
   'Cash', 15, 0, 'Captain ToTo', 'SUP-0001', 5, 2026);
