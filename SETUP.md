# Galveston Virtual Offices — Setup

A multi-tenant business platform on Next.js 16 + Supabase. It sells virtual mailboxes,
office bookings, AI marketing assistants, and website/platform builds — with online signup,
**pay-by-mailed-check** invoicing, a customer dashboard (incl. a mail inbox), and an admin back office.

## 1. Apply the database schema

In the [Supabase dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**:

1. Open `supabase/migrations/0001_init.sql`, paste the whole file, and click **Run**.
2. Open `supabase/migrations/0002_virtual_assistants.sql`, paste it, and **Run** (adds the
   managed-VA tables: roster, applications, client requests + VA pricing plans).
3. Open `supabase/seed.sql`, paste it, and **Run** (creates the first tenant, sample catalog,
   and the private `mail` storage bucket). Run this one **once**.

> Prefer the CLI? `npx supabase db push` then `npx supabase db execute -f supabase/seed.sql`
> (requires `npx supabase login` + `npx supabase link`).

## 2. Fill in your keys

`.env.local` already has your project URL and publishable key. Add your **secret** key
(Supabase → Project Settings → API → `service_role`) — locally only, never commit it:

```
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx
```

## 3. (Dev convenience) Email confirmation

Supabase → **Authentication → Providers → Email**. For fast local testing you can turn
**Confirm email** off; for production leave it on (the app handles the confirm link at `/auth/confirm`).

## 4. Run it

```
npm run dev
```

Open http://localhost:3000.

## 5. Make yourself the admin

1. Sign up at `/signup`.
2. In the SQL Editor, promote your account:
   ```sql
   update public.profiles set role = 'owner' where email = 'you@example.com';
   ```
3. Reload — you'll see the **Admin** link. Admin lives at `/admin`.

## How the money flow works (pay by business check)

Payment is **business check only** — by design. Requiring a business check verifies the
customer has a real business bank account, which keeps every account legitimate.

1. A customer signs up and orders a mailbox / office / service.
2. The app creates an **invoice** (`awaiting_payment`) with a reference code and shows your
   mailing address + amount on `/dashboard/invoices/[id]`.
3. The customer mails a **business check** with the reference in the memo.
4. You open **Admin → Invoices / Checks**, click **Record check received** — the invoice flips
   to `paid` and the related mailbox/booking/order **activates automatically**.

## Multi-tenant notes

- Every business is a row in `tenants`; all data is scoped by `tenant_id` and isolated by
  **Row-Level Security** (see `0001_init.sql`).
- Locally the active tenant comes from `NEXT_PUBLIC_DEFAULT_TENANT` (`galveston`).
- In production, tenants resolve by subdomain (`acme.galvestonvirtualoffices.com`) or a custom
  `domain` on the tenant row.

## Key paths

| Area | Path |
|------|------|
| Marketing | `/`, `/virtual-assistants`, `/offices`, `/mailboxes`, `/services/marketing`, `/services/platforms`, `/pricing`, `/contact` |
| Virtual assistants | `/virtual-assistants` (overview + pricing + roster), `/virtual-assistants/request` (client form), `/virtual-assistants/apply` (VA form) |
| Auth | `/signup`, `/login` |
| Customer dashboard | `/dashboard` (mail, bookings, mailbox, services, invoices, profile) |
| Admin back office | `/admin` — **Client Requests (matching)**, **Assistants (applications + roster)**, log mail, record checks, bookings, orders, customers, messages |
| Schema / RLS | `supabase/migrations/0001_init.sql`, `supabase/migrations/0002_virtual_assistants.sql` |
| Seed + storage | `supabase/seed.sql` |

## Coming later: task portal

The data model is matching-ready (client requests → assigned assistant). A lightweight **task
portal** (clients post tasks, assistants update status) is the natural next layer on top of the
`client_requests` ↔ `assistants` relationship.
