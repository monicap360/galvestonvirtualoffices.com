-- Keep the live Coworking Desk catalog aligned with the approved public price.
update public.offices
set price_per_day_cents = 1500,
    price_per_month_cents = 19900
where slug = 'coworking-desk';
