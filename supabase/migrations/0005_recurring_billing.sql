-- Automatic recurring invoicing (business-check model — no payment processor).
-- Creates a fresh "awaiting_payment" check invoice each month for every active
-- subscription / recurring service that hasn't been billed in the last ~28 days.
-- Run once in the Supabase SQL editor for the Galveston project.

-- 1) The billing function
create or replace function public.generate_due_invoices()
returns void language plpgsql security definer set search_path = public as $$
begin
  -- Active virtual-mailbox subscriptions
  insert into public.invoices (tenant_id, user_id, reference, description, amount_cents, payment_method, status, related_type, related_id)
  select s.tenant_id, s.user_id, 'GVO-' || upper(substr(md5(random()::text), 1, 6)),
         'Virtual mailbox — ' || p.name || ' (monthly)', p.price_cents, 'check', 'awaiting_payment', 'subscription', s.id
  from public.mailbox_subscriptions s
  join public.mailbox_plans p on p.id = s.plan_id
  where s.status = 'active'
    and not exists (
      select 1 from public.invoices i
      where i.related_type = 'subscription' and i.related_id = s.id
        and i.created_at > now() - interval '28 days'
    );

  -- Active recurring service orders (skip one-time builds: interval is null)
  insert into public.invoices (tenant_id, user_id, reference, description, amount_cents, payment_method, status, related_type, related_id)
  select o.tenant_id, o.user_id, 'GVO-' || upper(substr(md5(random()::text), 1, 6)),
         'Service — ' || sv.name || ' (recurring)', sv.base_price_cents, 'check', 'awaiting_payment', 'service_order', o.id
  from public.service_orders o
  join public.services sv on sv.id = o.service_id
  where o.status = 'active' and sv.interval is not null
    and not exists (
      select 1 from public.invoices i
      where i.related_type = 'service_order' and i.related_id = o.id
        and i.created_at > now() - interval '28 days'
    );
end; $$;

-- 2) Schedule it (enable pg_cron once via Dashboard → Database → Extensions, or the line below)
create extension if not exists pg_cron;

-- Runs daily at 13:00 UTC (~8am Central). It only bills subscriptions that are actually
-- due (more than 28 days since their last invoice), so daily is safe.
select cron.schedule('gvo-recurring-billing', '0 13 * * *', $$ select public.generate_due_invoices(); $$);
