-- Galveston Virtual Offices — multi-tenant schema with Row-Level Security
-- Apply via: supabase db push  (or paste into the Supabase SQL editor)

-- ============================================================
-- Helper: updated_at trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ============================================================
-- Tenants  (each business/brand/location on the platform)
-- ============================================================
create table public.tenants (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,          -- used for subdomain/path routing
  name        text not null,
  domain      text unique,                   -- optional custom domain
  support_email text,
  mailing_address text,                      -- where customers mail checks
  brand_color text default '#0e7490',
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- Profiles  (one row per auth user, scoped to a tenant)
-- ============================================================
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  tenant_id  uuid not null references public.tenants(id) on delete cascade,
  email      text not null,
  full_name  text not null default '',
  phone      text,
  role       text not null default 'customer'
             check (role in ('customer','admin','owner')),
  created_at timestamptz not null default now()
);
create index profiles_tenant_idx on public.profiles(tenant_id);

-- ---- Security-definer helpers (bypass RLS to read caller's own profile) ----
create or replace function public.current_tenant_id()
returns uuid language sql stable security definer set search_path = public as $$
  select tenant_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','owner')
  );
$$;

-- ---- Create a profile automatically when a user signs up ----
-- tenant_id + full_name come from auth signup metadata.
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Office space + bookings
-- ============================================================
create table public.offices (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants(id) on delete cascade,
  name            text not null,
  slug            text not null,
  description     text not null default '',
  type            text not null default 'Private Office',
  capacity        int  not null default 1,
  size_sqft       int,
  price_per_day_cents   int not null default 0,
  price_per_month_cents int,
  image_url       text,
  active          boolean not null default true,
  created_at      timestamptz not null default now(),
  unique (tenant_id, slug)
);
create index offices_tenant_idx on public.offices(tenant_id);

create table public.bookings (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  office_id   uuid not null references public.offices(id) on delete restrict,
  start_date  date not null,
  end_date    date not null,
  total_cents int not null default 0,
  status      text not null default 'pending'
              check (status in ('pending','confirmed','cancelled')),
  notes       text,
  created_at  timestamptz not null default now()
);
create index bookings_tenant_idx on public.bookings(tenant_id);
create index bookings_user_idx on public.bookings(user_id);

-- ============================================================
-- Virtual mailboxes
-- ============================================================
create table public.mailbox_plans (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  name        text not null,
  slug        text not null,
  description text not null default '',
  price_cents int not null default 0,
  interval    text not null default 'month' check (interval in ('month','year')),
  features    jsonb not null default '[]'::jsonb,
  active      boolean not null default true,
  unique (tenant_id, slug)
);
create index mailbox_plans_tenant_idx on public.mailbox_plans(tenant_id);

create table public.mailbox_subscriptions (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      uuid not null references public.tenants(id) on delete cascade,
  user_id        uuid not null references public.profiles(id) on delete cascade,
  plan_id        uuid not null references public.mailbox_plans(id) on delete restrict,
  mailbox_number text not null,
  status         text not null default 'pending'
                 check (status in ('pending','active','past_due','cancelled')),
  form_1583_url  text,                       -- USPS Form 1583 (CMRA compliance)
  started_at     timestamptz,
  created_at     timestamptz not null default now(),
  unique (tenant_id, mailbox_number)
);
create index mailbox_subs_tenant_idx on public.mailbox_subscriptions(tenant_id);
create index mailbox_subs_user_idx on public.mailbox_subscriptions(user_id);

create table public.mail_items (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  subscription_id uuid references public.mailbox_subscriptions(id) on delete set null,
  type            text not null default 'letter'
                  check (type in ('letter','package','large_package')),
  sender          text,
  description     text,
  photo_path      text,                      -- object key in the 'mail' storage bucket
  status          text not null default 'received'
                  check (status in ('received','ready_for_pickup','picked_up','forwarded','shredded')),
  received_at     timestamptz not null default now(),
  picked_up_at    timestamptz
);
create index mail_items_tenant_idx on public.mail_items(tenant_id);
create index mail_items_user_idx on public.mail_items(user_id);

-- ============================================================
-- Services (AI marketing assistants + website/platform builds)
-- ============================================================
create table public.services (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants(id) on delete cascade,
  name            text not null,
  slug            text not null,
  category        text not null
                  check (category in ('marketing_assistant','web_platform','bundle')),
  tagline         text not null default '',
  description     text not null default '',
  base_price_cents int not null default 0,
  interval        text check (interval in ('month','year')),  -- null = one-time
  features        jsonb not null default '[]'::jsonb,
  active          boolean not null default true,
  unique (tenant_id, slug)
);
create index services_tenant_idx on public.services(tenant_id);

create table public.service_orders (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         uuid not null references public.tenants(id) on delete cascade,
  user_id           uuid not null references public.profiles(id) on delete cascade,
  service_id        uuid not null references public.services(id) on delete restrict,
  status            text not null default 'inquiry'
                    check (status in ('inquiry','quoted','in_progress','active','completed','cancelled')),
  config            jsonb not null default '{}'::jsonb,   -- customer's customization answers
  notes             text,
  quoted_price_cents int,
  created_at        timestamptz not null default now()
);
create index service_orders_tenant_idx on public.service_orders(tenant_id);
create index service_orders_user_idx on public.service_orders(user_id);

-- ============================================================
-- Invoices  (supports pay-by-mailed-check)
-- ============================================================
create table public.invoices (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      uuid not null references public.tenants(id) on delete cascade,
  user_id        uuid not null references public.profiles(id) on delete cascade,
  reference      text not null,                       -- human code shown on the check memo
  description    text not null default '',
  amount_cents   int not null,
  currency       text not null default 'usd',
  payment_method text not null default 'check'
                 check (payment_method in ('check','card','ach')),
  status         text not null default 'awaiting_payment'
                 check (status in ('draft','awaiting_payment','paid','void')),
  related_type   text,                                -- 'booking' | 'subscription' | 'service_order'
  related_id     uuid,
  created_at     timestamptz not null default now(),
  paid_at        timestamptz,
  unique (tenant_id, reference)
);
create index invoices_tenant_idx on public.invoices(tenant_id);
create index invoices_user_idx on public.invoices(user_id);

-- ============================================================
-- Contact / leads
-- ============================================================
create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references public.tenants(id) on delete cascade,
  name       text not null,
  email      text not null,
  phone      text,
  subject    text,
  message    text not null,
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);
create index contact_tenant_idx on public.contact_messages(tenant_id);

-- ============================================================
-- Row-Level Security
-- ============================================================
alter table public.tenants              enable row level security;
alter table public.profiles             enable row level security;
alter table public.offices              enable row level security;
alter table public.bookings             enable row level security;
alter table public.mailbox_plans        enable row level security;
alter table public.mailbox_subscriptions enable row level security;
alter table public.mail_items           enable row level security;
alter table public.services             enable row level security;
alter table public.service_orders       enable row level security;
alter table public.invoices             enable row level security;
alter table public.contact_messages     enable row level security;

-- ---- Tenants: anyone may read active tenants (needed to resolve a site) ----
create policy tenants_read on public.tenants
  for select using (active = true or id = public.current_tenant_id());
create policy tenants_staff_update on public.tenants
  for update using (id = public.current_tenant_id() and public.is_staff());

-- ---- Profiles ----
create policy profiles_self_or_staff_read on public.profiles
  for select using (id = auth.uid() or (tenant_id = public.current_tenant_id() and public.is_staff()));
create policy profiles_self_update on public.profiles
  for update using (id = auth.uid());
create policy profiles_staff_update on public.profiles
  for update using (tenant_id = public.current_tenant_id() and public.is_staff());

-- ---- Public catalog (offices / mailbox_plans / services): read active rows ----
-- Marketing pages read these without a logged-in user, so allow anon to read
-- active rows. Tenant scoping for the public site is applied in the query.
create policy offices_public_read on public.offices
  for select using (active = true or (tenant_id = public.current_tenant_id() and public.is_staff()));
create policy offices_staff_write on public.offices
  for all using (tenant_id = public.current_tenant_id() and public.is_staff())
  with check (tenant_id = public.current_tenant_id() and public.is_staff());

create policy plans_public_read on public.mailbox_plans
  for select using (active = true or (tenant_id = public.current_tenant_id() and public.is_staff()));
create policy plans_staff_write on public.mailbox_plans
  for all using (tenant_id = public.current_tenant_id() and public.is_staff())
  with check (tenant_id = public.current_tenant_id() and public.is_staff());

create policy services_public_read on public.services
  for select using (active = true or (tenant_id = public.current_tenant_id() and public.is_staff()));
create policy services_staff_write on public.services
  for all using (tenant_id = public.current_tenant_id() and public.is_staff())
  with check (tenant_id = public.current_tenant_id() and public.is_staff());

-- ---- Owner-or-staff data: bookings, subscriptions, mail, orders, invoices ----
-- Pattern: a customer sees/changes their own rows; staff see/change all rows in their tenant.
create policy bookings_rw on public.bookings
  for all using (
    tenant_id = public.current_tenant_id()
    and (user_id = auth.uid() or public.is_staff())
  ) with check (
    tenant_id = public.current_tenant_id()
    and (user_id = auth.uid() or public.is_staff())
  );

create policy subs_rw on public.mailbox_subscriptions
  for all using (
    tenant_id = public.current_tenant_id()
    and (user_id = auth.uid() or public.is_staff())
  ) with check (
    tenant_id = public.current_tenant_id()
    and (user_id = auth.uid() or public.is_staff())
  );

create policy mail_rw on public.mail_items
  for all using (
    tenant_id = public.current_tenant_id()
    and (user_id = auth.uid() or public.is_staff())
  ) with check (
    tenant_id = public.current_tenant_id()
    and (user_id = auth.uid() or public.is_staff())
  );

create policy orders_rw on public.service_orders
  for all using (
    tenant_id = public.current_tenant_id()
    and (user_id = auth.uid() or public.is_staff())
  ) with check (
    tenant_id = public.current_tenant_id()
    and (user_id = auth.uid() or public.is_staff())
  );

create policy invoices_rw on public.invoices
  for all using (
    tenant_id = public.current_tenant_id()
    and (user_id = auth.uid() or public.is_staff())
  ) with check (
    tenant_id = public.current_tenant_id()
    and (user_id = auth.uid() or public.is_staff())
  );

-- ---- Contact messages: anyone may submit; only staff may read/manage ----
create policy contact_insert on public.contact_messages
  for insert with check (true);
create policy contact_staff_read on public.contact_messages
  for select using (tenant_id = public.current_tenant_id() and public.is_staff());
create policy contact_staff_update on public.contact_messages
  for update using (tenant_id = public.current_tenant_id() and public.is_staff());
