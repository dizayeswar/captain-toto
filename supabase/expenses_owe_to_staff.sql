-- Add owe_to_staff flag: when Paid By is not ToTo Balance and this is true,
-- the expense appears under "ToTo owes others". Safe to re-run.

alter table public.expenses
  add column if not exists owe_to_staff boolean not null default false;

-- Keep existing staff-paid expenses in "owes others" until edited
update public.expenses
set owe_to_staff = true
where coalesce(trim(paid_by), '') <> ''
  and trim(paid_by) <> 'ToTo Balance'
  and owe_to_staff = false;
