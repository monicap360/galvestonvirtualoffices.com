-- Approved public Coworking Desk price: $12/day and $199/month.
update public.offices
set price_per_day_cents = 1200,
    price_per_month_cents = 19900
where slug = 'coworking-desk';
