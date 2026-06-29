-- ============================================================================
-- Galveston Virtual Offices — COMPLETE SETUP (run this whole file once)
-- Paste ALL of this into the Supabase SQL editor and click Run.
-- Safe to run more than once (idempotent).
-- ============================================================================

-- ---------- helpers ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- ---------- tenants ----------
create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  domain text unique,
  support_email text,
  mailing_address text,
  brand_color text default '#0e7490',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  phone text,
  role text not null default 'customer' check (role in ('customer','admin','owner')),
  created_at timestamptz not null default now()
);
create index if not exists profiles_tenant_idx on public.profiles(tenant_id);

create or replace function public.current_tenant_id()
returns uuid language sql stable security definer set search_path = public as $$
  select tenant_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','owner'));
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, tenant_id, email, full_name, phone)
  values (
    new.id,
    (new.raw_user_meta_data->>'tenant_id')::uuid,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name',''),
    new.raw_user_meta_data->>'phone'
  );
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- ---------- offices + bookings ----------
create table if not exists public.offices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null, slug text not null,
  description text not null default '',
  type text not null default 'Private Office',
  capacity int not null default 1, size_sqft int,
  price_per_day_cents int not null default 0, price_per_month_cents int,
  image_url text, active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, slug)
);
create index if not exists offices_tenant_idx on public.offices(tenant_id);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  office_id uuid not null references public.offices(id) on delete restrict,
  start_date date not null, end_date date not null,
  total_cents int not null default 0,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  notes text, created_at timestamptz not null default now()
);
create index if not exists bookings_tenant_idx on public.bookings(tenant_id);
create index if not exists bookings_user_idx on public.bookings(user_id);

-- ---------- mailboxes ----------
create table if not exists public.mailbox_plans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null, slug text not null,
  description text not null default '',
  price_cents int not null default 0,
  interval text not null default 'month' check (interval in ('month','year')),
  features jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  unique (tenant_id, slug)
);
create index if not exists mailbox_plans_tenant_idx on public.mailbox_plans(tenant_id);

create table if not exists public.mailbox_subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.mailbox_plans(id) on delete restrict,
  mailbox_number text not null,
  status text not null default 'pending' check (status in ('pending','active','past_due','cancelled')),
  form_1583_url text, started_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, mailbox_number)
);
create index if not exists mailbox_subs_tenant_idx on public.mailbox_subscriptions(tenant_id);
create index if not exists mailbox_subs_user_idx on public.mailbox_subscriptions(user_id);

create table if not exists public.mail_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  subscription_id uuid references public.mailbox_subscriptions(id) on delete set null,
  type text not null default 'letter' check (type in ('letter','package','large_package')),
  sender text, description text, photo_path text,
  status text not null default 'received' check (status in ('received','ready_for_pickup','picked_up','forwarded','shredded')),
  received_at timestamptz not null default now(), picked_up_at timestamptz
);
create index if not exists mail_items_tenant_idx on public.mail_items(tenant_id);
create index if not exists mail_items_user_idx on public.mail_items(user_id);

-- ---------- services + orders ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null, slug text not null,
  category text not null,
  tagline text not null default '', description text not null default '',
  base_price_cents int not null default 0,
  interval text check (interval in ('month','year')),
  features jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  unique (tenant_id, slug)
);
alter table public.services drop constraint if exists services_category_check;
alter table public.services add constraint services_category_check
  check (category in ('marketing_assistant','web_platform','bundle','virtual_assistant'));
create index if not exists services_tenant_idx on public.services(tenant_id);

create table if not exists public.service_orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete restrict,
  status text not null default 'inquiry' check (status in ('inquiry','quoted','in_progress','active','completed','cancelled')),
  config jsonb not null default '{}'::jsonb, notes text,
  quoted_price_cents int, created_at timestamptz not null default now()
);
create index if not exists service_orders_tenant_idx on public.service_orders(tenant_id);
create index if not exists service_orders_user_idx on public.service_orders(user_id);

-- ---------- invoices ----------
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reference text not null, description text not null default '',
  amount_cents int not null, currency text not null default 'usd',
  payment_method text not null default 'check' check (payment_method in ('check','card','ach')),
  status text not null default 'awaiting_payment' check (status in ('draft','awaiting_payment','paid','void')),
  related_type text, related_id uuid,
  created_at timestamptz not null default now(), paid_at timestamptz,
  unique (tenant_id, reference)
);
create index if not exists invoices_tenant_idx on public.invoices(tenant_id);
create index if not exists invoices_user_idx on public.invoices(user_id);

-- ---------- contact ----------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null, email text not null, phone text,
  subject text, message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists contact_tenant_idx on public.contact_messages(tenant_id);

-- ---------- virtual assistants ----------
create table if not exists public.assistants (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null, email text, phone text,
  headline text not null default '', bio text not null default '',
  skills jsonb not null default '[]'::jsonb,
  hourly_rate_cents int not null default 0, availability text, photo_url text,
  active boolean not null default true, created_at timestamptz not null default now()
);
create index if not exists assistants_tenant_idx on public.assistants(tenant_id);

create table if not exists public.assistant_applications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null, email text not null, phone text,
  skills text not null default '', experience text, availability text,
  desired_rate_cents int, bio text, links text,
  status text not null default 'applied' check (status in ('applied','screening','approved','rejected')),
  created_at timestamptz not null default now()
);
create index if not exists applications_tenant_idx on public.assistant_applications(tenant_id);

create table if not exists public.client_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  business_name text, contact_name text not null, email text not null, phone text,
  summary text not null, skills_needed text, hours_per_week int, budget_cents int,
  status text not null default 'new' check (status in ('new','matching','matched','active','closed')),
  assigned_assistant_id uuid references public.assistants(id) on delete set null,
  admin_notes text, created_at timestamptz not null default now()
);
create index if not exists requests_tenant_idx on public.client_requests(tenant_id);
create index if not exists requests_user_idx on public.client_requests(user_id);

-- ============================================================================
-- Row-Level Security
-- ============================================================================
alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.offices enable row level security;
alter table public.bookings enable row level security;
alter table public.mailbox_plans enable row level security;
alter table public.mailbox_subscriptions enable row level security;
alter table public.mail_items enable row level security;
alter table public.services enable row level security;
alter table public.service_orders enable row level security;
alter table public.invoices enable row level security;
alter table public.contact_messages enable row level security;
alter table public.assistants enable row level security;
alter table public.assistant_applications enable row level security;
alter table public.client_requests enable row level security;

drop policy if exists tenants_read on public.tenants;
create policy tenants_read on public.tenants for select using (active = true or id = public.current_tenant_id());
drop policy if exists tenants_staff_update on public.tenants;
create policy tenants_staff_update on public.tenants for update using (id = public.current_tenant_id() and public.is_staff());

drop policy if exists profiles_self_or_staff_read on public.profiles;
create policy profiles_self_or_staff_read on public.profiles for select using (id = auth.uid() or (tenant_id = public.current_tenant_id() and public.is_staff()));
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles for update using (id = auth.uid());
drop policy if exists profiles_staff_update on public.profiles;
create policy profiles_staff_update on public.profiles for update using (tenant_id = public.current_tenant_id() and public.is_staff());

drop policy if exists offices_public_read on public.offices;
create policy offices_public_read on public.offices for select using (active = true or (tenant_id = public.current_tenant_id() and public.is_staff()));
drop policy if exists offices_staff_write on public.offices;
create policy offices_staff_write on public.offices for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());

drop policy if exists plans_public_read on public.mailbox_plans;
create policy plans_public_read on public.mailbox_plans for select using (active = true or (tenant_id = public.current_tenant_id() and public.is_staff()));
drop policy if exists plans_staff_write on public.mailbox_plans;
create policy plans_staff_write on public.mailbox_plans for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());

drop policy if exists services_public_read on public.services;
create policy services_public_read on public.services for select using (active = true or (tenant_id = public.current_tenant_id() and public.is_staff()));
drop policy if exists services_staff_write on public.services;
create policy services_staff_write on public.services for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());

drop policy if exists bookings_rw on public.bookings;
create policy bookings_rw on public.bookings for all using (tenant_id = public.current_tenant_id() and (user_id = auth.uid() or public.is_staff())) with check (tenant_id = public.current_tenant_id() and (user_id = auth.uid() or public.is_staff()));

drop policy if exists subs_rw on public.mailbox_subscriptions;
create policy subs_rw on public.mailbox_subscriptions for all using (tenant_id = public.current_tenant_id() and (user_id = auth.uid() or public.is_staff())) with check (tenant_id = public.current_tenant_id() and (user_id = auth.uid() or public.is_staff()));

drop policy if exists mail_rw on public.mail_items;
create policy mail_rw on public.mail_items for all using (tenant_id = public.current_tenant_id() and (user_id = auth.uid() or public.is_staff())) with check (tenant_id = public.current_tenant_id() and (user_id = auth.uid() or public.is_staff()));

drop policy if exists orders_rw on public.service_orders;
create policy orders_rw on public.service_orders for all using (tenant_id = public.current_tenant_id() and (user_id = auth.uid() or public.is_staff())) with check (tenant_id = public.current_tenant_id() and (user_id = auth.uid() or public.is_staff()));

drop policy if exists invoices_rw on public.invoices;
create policy invoices_rw on public.invoices for all using (tenant_id = public.current_tenant_id() and (user_id = auth.uid() or public.is_staff())) with check (tenant_id = public.current_tenant_id() and (user_id = auth.uid() or public.is_staff()));

drop policy if exists contact_insert on public.contact_messages;
create policy contact_insert on public.contact_messages for insert with check (true);
drop policy if exists contact_staff_read on public.contact_messages;
create policy contact_staff_read on public.contact_messages for select using (tenant_id = public.current_tenant_id() and public.is_staff());
drop policy if exists contact_staff_update on public.contact_messages;
create policy contact_staff_update on public.contact_messages for update using (tenant_id = public.current_tenant_id() and public.is_staff());

drop policy if exists assistants_public_read on public.assistants;
create policy assistants_public_read on public.assistants for select using (active = true or (tenant_id = public.current_tenant_id() and public.is_staff()));
drop policy if exists assistants_staff_write on public.assistants;
create policy assistants_staff_write on public.assistants for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());

drop policy if exists applications_insert on public.assistant_applications;
create policy applications_insert on public.assistant_applications for insert with check (true);
drop policy if exists applications_staff_read on public.assistant_applications;
create policy applications_staff_read on public.assistant_applications for select using (tenant_id = public.current_tenant_id() and public.is_staff());
drop policy if exists applications_staff_update on public.assistant_applications;
create policy applications_staff_update on public.assistant_applications for update using (tenant_id = public.current_tenant_id() and public.is_staff());

drop policy if exists requests_insert on public.client_requests;
create policy requests_insert on public.client_requests for insert with check (true);
drop policy if exists requests_read on public.client_requests;
create policy requests_read on public.client_requests for select using (tenant_id = public.current_tenant_id() and (user_id = auth.uid() or public.is_staff()));
drop policy if exists requests_staff_update on public.client_requests;
create policy requests_staff_update on public.client_requests for update using (tenant_id = public.current_tenant_id() and public.is_staff());

-- ============================================================================
-- Seed data
-- ============================================================================
insert into public.tenants (id, slug, name, support_email, mailing_address, brand_color)
values ('00000000-0000-0000-0000-000000000001','galveston','Galveston Virtual Offices',
  'hello@galvestonvirtualoffices.com','Galveston Virtual Offices, 2200 Market St, Galveston, TX 77550','#0e7490')
on conflict (id) do update set name = excluded.name, mailing_address = excluded.mailing_address;

insert into public.offices (tenant_id, name, slug, description, type, capacity, size_sqft, price_per_day_cents, price_per_month_cents)
values
  ('00000000-0000-0000-0000-000000000001','Harborview Private Office','harborview','Quiet private office with natural light, fiber internet, and 24/7 access.','Private Office',2,120,7500,89000),
  ('00000000-0000-0000-0000-000000000001','Strand Day Office','strand-day','Book by the day. Perfect for client meetings or a focused work session.','Day Office',2,90,4500,null),
  ('00000000-0000-0000-0000-000000000001','Seawall Meeting Room','seawall-meeting','Conference room for up to 8 with display, whiteboard, and coffee.','Meeting Room',8,200,9500,null),
  ('00000000-0000-0000-0000-000000000001','Coworking Desk','coworking-desk','Hot desk in the shared lounge with all amenities included.','Desk',1,40,2500,29900)
on conflict (tenant_id, slug) do nothing;

insert into public.mailbox_plans (tenant_id, name, slug, description, price_cents, interval, features)
values
  ('00000000-0000-0000-0000-000000000001','Mailbox Starter','starter','A real Galveston street address for your mail.',1900,'month','["Real street address (not a PO box)","Mail received & photographed","Email + dashboard notifications","Pickup during business hours"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','Mailbox Pro','pro','For businesses that need scanning and forwarding.',3900,'month','["Everything in Starter","AI mail sorting (bill / check / legal / junk)","Open & scan contents on request","Mail forwarding","Check deposit assistance"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','Business Address + Registered Agent','business-agent','Address plus Texas registered-agent service for your LLC.',5900,'month','["Everything in Pro","Texas registered-agent service","Use for LLC, bank & Google Business","Compliance mail handling","Priority forwarding"]'::jsonb)
on conflict (tenant_id, slug) do nothing;

insert into public.services (tenant_id, name, slug, category, tagline, description, base_price_cents, interval, features)
values
  ('00000000-0000-0000-0000-000000000001','AI Marketing Assistant — Starter','ai-marketing-starter','marketing_assistant','Your always-on local marketing helper.','A customized AI assistant that manages your Google Business Profile, requests & answers reviews, and posts to social.',29900,'month','["Google Business Profile management","Review requests & AI responses","4 social posts / week","Monthly performance report"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','AI Marketing Assistant — Growth','ai-marketing-growth','marketing_assistant','Done-for-you local SEO + content + chatbot.','Everything in Starter plus local SEO, blog content, and an AI website chatbot trained on your business.',59900,'month','["Everything in Starter","Local SEO optimization","2 blog posts / month","AI website chatbot","Lead capture & follow-up"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','Website Build','website-build','web_platform','A fast, modern website for your business.','Custom small-business website with booking, contact forms, and mobile-first design. One-time build.',250000,null,'["Up to 6 pages","Booking & contact forms","Mobile-first & SEO-ready","Hosting setup","2 rounds of revisions"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','Business Platform','business-platform','web_platform','Front-end website + admin back office, built for you.','A full platform like this one: customer-facing site plus an admin dashboard to run your business. Quoted per project.',750000,null,'["Customer-facing website","Admin back-office dashboard","Customer accounts & logins","Payments & invoicing","Custom workflows"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','Business-in-a-Box','business-in-a-box','bundle','Launch your business in one package.','Address + registered agent + mailbox + website + AI marketing assistant, bundled at one monthly price.',99900,'month','["Business address + registered agent","Pro virtual mailbox","Starter website","AI Marketing Assistant","Priority support"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','Managed VA — Part-Time','va-part-time','virtual_assistant','A dedicated assistant, ~20 hours a week.','We recruit, vet, and manage a virtual assistant matched to your business — admin, scheduling, inbox, customer follow-up, and more.',79900,'month','["~20 hours / week","Dedicated, vetted assistant","We handle matching & management","Admin, scheduling, inbox, follow-up","Backup coverage if your VA is out"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','Managed VA — Full-Time','va-full-time','virtual_assistant','A full-time assistant, fully managed.','A dedicated full-time virtual assistant, recruited and managed by us, embedded in your day-to-day operations.',149900,'month','["~40 hours / week","Dedicated, vetted assistant","Priority matching & management","Ongoing performance check-ins","Backup coverage included"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','Business Support — Pay As You Go','va-payg','virtual_assistant','Hourly support when you need it.','On-demand virtual assistant hours billed monthly — perfect for overflow work and one-off projects.',3500,'month','["Billed for hours used","No minimum commitment","Same vetted assistant pool","Great for overflow & projects"]'::jsonb)
on conflict (tenant_id, slug) do nothing;

insert into public.assistants (tenant_id, name, headline, bio, skills, hourly_rate_cents, availability, active)
values
  ('00000000-0000-0000-0000-000000000001','Maria G.','Executive & Admin Assistant','Five years supporting busy founders with calendars, inboxes, travel, and CRM upkeep.','["Calendar management","Inbox triage","Travel booking","CRM / data entry","Customer support"]'::jsonb,2800,'Part-time', true),
  ('00000000-0000-0000-0000-000000000001','David R.','Bookkeeping & Operations VA','Detail-oriented operations assistant with QuickBooks and invoicing experience.','["Bookkeeping","Invoicing","QuickBooks","Scheduling","Vendor coordination"]'::jsonb,3200,'Full-time', true)
on conflict do nothing;

-- ---------- storage bucket for mail photos ----------
insert into storage.buckets (id, name, public) values ('mail','mail', false)
on conflict (id) do nothing;

drop policy if exists "mail read own or staff" on storage.objects;
create policy "mail read own or staff" on storage.objects for select to authenticated
  using (bucket_id = 'mail' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff()));
drop policy if exists "mail staff write" on storage.objects;
create policy "mail staff write" on storage.objects for insert to authenticated
  with check (bucket_id = 'mail' and public.is_staff());

-- Done. Now sign up at /signup, then run (with your email) to become admin:
--   update public.profiles set role = 'owner' where email = 'you@example.com';
