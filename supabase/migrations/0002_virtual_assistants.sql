-- Managed Virtual Assistants: roster, applications, and client requests (matching).
-- Apply after 0001_init.sql. Additive + idempotent where practical.

-- ---- Allow a 'virtual_assistant' service category ----
alter table public.services drop constraint if exists services_category_check;
alter table public.services add constraint services_category_check
  check (category in ('marketing_assistant','web_platform','bundle','virtual_assistant'));

-- ============================================================
-- Assistants (approved VAs available to match)
-- ============================================================
create table if not exists public.assistants (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid not null references public.tenants(id) on delete cascade,
  name             text not null,
  email            text,
  phone            text,
  headline         text not null default '',
  bio              text not null default '',
  skills           jsonb not null default '[]'::jsonb,
  hourly_rate_cents int not null default 0,
  availability     text,                       -- e.g. "Part-time", "20 hrs/wk"
  photo_url        text,
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);
create index if not exists assistants_tenant_idx on public.assistants(tenant_id);

-- ============================================================
-- Assistant applications (VAs applying to join)
-- ============================================================
create table if not exists public.assistant_applications (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid not null references public.tenants(id) on delete cascade,
  name             text not null,
  email            text not null,
  phone            text,
  skills           text not null default '',
  experience       text,
  availability     text,
  desired_rate_cents int,
  bio              text,
  links            text,                        -- portfolio / LinkedIn / resume URL
  status           text not null default 'applied'
                   check (status in ('applied','screening','approved','rejected')),
  created_at       timestamptz not null default now()
);
create index if not exists applications_tenant_idx on public.assistant_applications(tenant_id);

-- ============================================================
-- Client requests (clients needing a VA → matched by admin)
-- ============================================================
create table if not exists public.client_requests (
  id                  uuid primary key default gen_random_uuid(),
  tenant_id           uuid not null references public.tenants(id) on delete cascade,
  user_id             uuid references public.profiles(id) on delete set null,
  business_name       text,
  contact_name        text not null,
  email               text not null,
  phone               text,
  summary             text not null,
  skills_needed       text,
  hours_per_week      int,
  budget_cents        int,
  status              text not null default 'new'
                      check (status in ('new','matching','matched','active','closed')),
  assigned_assistant_id uuid references public.assistants(id) on delete set null,
  admin_notes         text,
  created_at          timestamptz not null default now()
);
create index if not exists requests_tenant_idx on public.client_requests(tenant_id);
create index if not exists requests_user_idx on public.client_requests(user_id);

-- ============================================================
-- Row-Level Security
-- ============================================================
alter table public.assistants             enable row level security;
alter table public.assistant_applications enable row level security;
alter table public.client_requests        enable row level security;

-- Assistants: public can see the active roster; staff manage everything.
create policy assistants_public_read on public.assistants
  for select using (active = true or (tenant_id = public.current_tenant_id() and public.is_staff()));
create policy assistants_staff_write on public.assistants
  for all using (tenant_id = public.current_tenant_id() and public.is_staff())
  with check (tenant_id = public.current_tenant_id() and public.is_staff());

-- Applications: anyone may apply (insert); only staff may read/manage.
create policy applications_insert on public.assistant_applications
  for insert with check (true);
create policy applications_staff_read on public.assistant_applications
  for select using (tenant_id = public.current_tenant_id() and public.is_staff());
create policy applications_staff_update on public.assistant_applications
  for update using (tenant_id = public.current_tenant_id() and public.is_staff());

-- Client requests: anyone may submit; the requester (if logged in) and staff may read.
create policy requests_insert on public.client_requests
  for insert with check (true);
create policy requests_read on public.client_requests
  for select using (
    tenant_id = public.current_tenant_id() and (user_id = auth.uid() or public.is_staff())
  );
create policy requests_staff_update on public.client_requests
  for update using (tenant_id = public.current_tenant_id() and public.is_staff());

-- ============================================================
-- Seed: managed VA pricing plans + a couple of sample assistants
-- ============================================================
insert into public.services (tenant_id, name, slug, category, tagline, description, base_price_cents, interval, features)
values
  ('00000000-0000-0000-0000-000000000001','Managed VA — Part-Time','va-part-time','virtual_assistant',
    'A dedicated assistant, ~20 hours a week.',
    'We recruit, vet, and manage a virtual assistant matched to your business — admin, scheduling, inbox, customer follow-up, and more.',
    79900,'month',
    '["~20 hours / week","Dedicated, vetted assistant","We handle matching & management","Admin, scheduling, inbox, follow-up","Backup coverage if your VA is out"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','Managed VA — Full-Time','va-full-time','virtual_assistant',
    'A full-time assistant, fully managed.',
    'A dedicated full-time virtual assistant, recruited and managed by us, embedded in your day-to-day operations.',
    149900,'month',
    '["~40 hours / week","Dedicated, vetted assistant","Priority matching & management","Ongoing performance check-ins","Backup coverage included"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','Business Support — Pay As You Go','va-payg','virtual_assistant',
    'Hourly support when you need it.',
    'On-demand virtual assistant hours billed monthly — perfect for overflow work and one-off projects.',
    3500,'month',
    '["Billed for hours used","No minimum commitment","Same vetted assistant pool","Great for overflow & projects"]'::jsonb)
on conflict (tenant_id, slug) do nothing;

insert into public.assistants (tenant_id, name, headline, bio, skills, hourly_rate_cents, availability, active)
values
  ('00000000-0000-0000-0000-000000000001','Maria G.','Executive & Admin Assistant',
    'Five years supporting busy founders with calendars, inboxes, travel, and CRM upkeep.',
    '["Calendar management","Inbox triage","Travel booking","CRM / data entry","Customer support"]'::jsonb,
    2800,'Part-time', true),
  ('00000000-0000-0000-0000-000000000001','David R.','Bookkeeping & Operations VA',
    'Detail-oriented operations assistant with QuickBooks and invoicing experience.',
    '["Bookkeeping","Invoicing","QuickBooks","Scheduling","Vendor coordination"]'::jsonb,
    3200,'Full-time', true)
on conflict do nothing;
