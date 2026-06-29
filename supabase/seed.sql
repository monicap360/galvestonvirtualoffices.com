-- Seed data for Galveston Virtual Offices (first tenant + catalog + storage)
-- Apply after 0001_init.sql.  Safe to re-run (uses fixed UUIDs / on-conflict).

-- ---- First tenant ----
insert into public.tenants (id, slug, name, support_email, mailing_address, brand_color)
values (
  '00000000-0000-0000-0000-000000000001',
  'galveston',
  'Galveston Virtual Offices',
  'hello@galvestonvirtualoffices.com',
  'Galveston Virtual Offices, 3501 Winnie St, Galveston, TX 77550',
  '#0e7490'
)
on conflict (id) do update set
  name = excluded.name,
  mailing_address = excluded.mailing_address;

-- ---- Offices ----
insert into public.offices (tenant_id, name, slug, description, type, capacity, size_sqft, price_per_day_cents, price_per_month_cents)
values
  ('00000000-0000-0000-0000-000000000001','Private Office','private-office','A quiet private office with natural light, fiber internet, and 24/7 access.','Private Office',2,120,7500,89000),
  ('00000000-0000-0000-0000-000000000001','Day Office','day-office','Rent by the day — a private office for client meetings or a focused work session.','Day Office',2,90,4500,null),
  ('00000000-0000-0000-0000-000000000001','Coworking Desk','coworking-desk','Hot desk in the shared lounge with all amenities included.','Desk',1,40,2500,29900)
on conflict (tenant_id, slug) do nothing;

-- ---- Virtual mailbox plans ----
insert into public.mailbox_plans (tenant_id, name, slug, description, price_cents, interval, features)
values
  ('00000000-0000-0000-0000-000000000001','Mailbox Starter','starter','A real Galveston street address for your mail.',1900,'month',
    '["Real street address (not a PO box)","Mail received & photographed","Email + dashboard notifications","Pickup during business hours"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','Mailbox Pro','pro','For businesses that need scanning and forwarding.',3900,'month',
    '["Everything in Starter","AI mail sorting (bill / check / legal / junk)","Open & scan contents on request","Mail forwarding","Check deposit assistance"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','Business Address + Registered Agent','business-agent','Address plus Texas registered-agent service for your LLC.',5900,'month',
    '["Everything in Pro","Texas registered-agent service","Use for LLC, bank & Google Business","Compliance mail handling","Priority forwarding"]'::jsonb)
on conflict (tenant_id, slug) do nothing;

-- ---- Services: AI marketing assistants + website/platform builds ----
insert into public.services (tenant_id, name, slug, category, tagline, description, base_price_cents, interval, features)
values
  ('00000000-0000-0000-0000-000000000001','AI Marketing Assistant — Starter','ai-marketing-starter','marketing_assistant',
    'Your always-on local marketing helper.',
    'A customized AI assistant that manages your Google Business Profile, requests & answers reviews, and posts to social.',
    29900,'month',
    '["Google Business Profile management","Review requests & AI responses","4 social posts / week","Monthly performance report"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','AI Marketing Assistant — Growth','ai-marketing-growth','marketing_assistant',
    'Done-for-you local SEO + content + chatbot.',
    'Everything in Starter plus local SEO, blog content, and an AI website chatbot trained on your business.',
    59900,'month',
    '["Everything in Starter","Local SEO optimization","2 blog posts / month","AI website chatbot","Lead capture & follow-up"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','Website Build','website-build','web_platform',
    'A fast, modern website for your business.',
    'Custom small-business website with booking, contact forms, and mobile-first design. One-time build.',
    250000,null,
    '["Up to 6 pages","Booking & contact forms","Mobile-first & SEO-ready","Hosting setup","2 rounds of revisions"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','Business Platform','business-platform','web_platform',
    'Front-end website + admin back office, built for you.',
    'A full platform like this one: customer-facing site plus an admin dashboard to run your business. Quoted per project.',
    750000,null,
    '["Customer-facing website","Admin back-office dashboard","Customer accounts & logins","Payments & invoicing","Custom workflows"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','Business-in-a-Box','business-in-a-box','bundle',
    'Launch your business in one package.',
    'Address + registered agent + mailbox + website + AI marketing assistant, bundled at one monthly price.',
    99900,'month',
    '["Business address + registered agent","Pro virtual mailbox","Starter website","AI Marketing Assistant","Priority support"]'::jsonb)
on conflict (tenant_id, slug) do nothing;

-- ---- Private storage bucket for mail/package photos ----
insert into storage.buckets (id, name, public)
values ('mail','mail', false)
on conflict (id) do nothing;

-- Storage RLS: customers read their own folder (mail/<user_id>/...); staff manage all.
create policy "mail read own or staff" on storage.objects
  for select to authenticated using (
    bucket_id = 'mail'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff())
  );
create policy "mail staff write" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'mail' and public.is_staff()
  );

-- ---- After you sign up your own account, promote it to owner: ----
-- update public.profiles set role = 'owner' where email = 'you@example.com';
