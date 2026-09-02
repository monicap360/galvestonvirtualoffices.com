# Guest-first service signup design

Date: 2026-09-02
Status: Ready for owner review

## Goal

Let a visitor request an office, mailbox, or business service without creating a password or logging in first. The request must be saved immediately, the office must be notified, and the visitor must be able to activate a dashboard later through a secure email link.

## Current constraint

`createBooking`, `subscribeMailbox`, and `orderService` begin with `requireProfile()`. Their destination tables and invoices also require a `profiles.id`, so a signed-out visitor cannot submit a request. Existing signed-in checkout behavior should continue unchanged.

## Customer experience

1. A signed-out visitor selects the office, mailbox plan, or service they want.
2. The page asks only for the missing request information: name, email, phone, and service-specific details. It does not ask for a password.
3. The server validates the selected catalog item, dates, price, and contact fields, then saves a pending request and notifies the office.
4. The visitor sees a success page with a non-sensitive reference number. Saving the request does not depend on email delivery succeeding.
5. Supabase sends a one-time Magic Link to the submitted address. The link signs in an existing customer or creates a passwordless account for a new customer, then takes them to the request activation page.
6. Activation verifies the authenticated email against the request and converts the pending request into the existing booking, mailbox subscription, service order, and invoice records in one database transaction.
7. The customer lands in the dashboard and may add a password later. A login is never required before the initial request is accepted.

An office request remains a request until activation and staff confirmation; the success screen must not imply that room availability is guaranteed. A mailbox number is not assigned and an invoice is not created until activation.

## Data model

Add `public.service_signups` as an intake boundary instead of weakening the ownership rules on operational tables.

| Field | Purpose |
| --- | --- |
| `id uuid` | Internal, unguessable request identifier |
| `tenant_id uuid` | Tenant ownership |
| `reference text unique` | Customer-safe confirmation reference |
| `request_type text` | `office_booking`, `mailbox`, or `service` |
| `selection_id uuid` | Selected office, mailbox plan, or service |
| `contact_name`, `contact_email`, `contact_phone` | Guest contact details |
| `request_data jsonb` | Validated dates or service configuration |
| `quoted_amount_cents int` | Server-calculated amount shown at submission |
| `status text` | `submitted`, `activation_sent`, `claimed`, `converted`, `closed` |
| `profile_id uuid null` | Set only after verified activation |
| `converted_type`, `converted_id` | Idempotent link to the created operational record |
| `idempotency_key text unique` | Prevents double submission from retries or double clicks |
| `claim_expires_at timestamptz` | Time limit for self-service activation |
| timestamps | Audit and support visibility |

Do not store a raw authentication or bearer token in this table. The activation URL carries only the request ID inside Supabase's one-time email flow; activation still requires an authenticated session whose verified email matches `contact_email`.

## Server and database boundaries

- The public form calls a Next.js server action. It validates field lengths, normalizes the phone number, validates active catalog records, recalculates prices, checks date ordering, includes a honeypot, and applies request throttling before writing.
- The server-only Supabase admin client writes `service_signups`. Its secret never reaches client code.
- `service_signups` has RLS enabled. Revoke every table privilege from `anon` and `authenticated`, then grant staff only the operations needed for the admin queue. The service role remains server-only.
- Add a `public.convert_service_signup` function for the atomic conversion, revoke function execution from `public`, `anon`, and `authenticated`, and grant it only to `service_role`.
- The activation handler first uses the normal server client and `auth.getUser()` to establish the authenticated user. It then verifies the user's normalized, verified email and tenant against the request before calling the privileged conversion function.
- Conversion locks the signup row, exits successfully when already converted, creates exactly one operational record and invoice, records the result, and commits atomically.
- Never log contact details, Magic Link contents, Supabase secrets, or request payloads. Log only the safe reference and status.

This follows Supabase's current guidance that exposed tables need both least-privilege grants and RLS, that service credentials must remain server-side, and that Magic Links are one-time passwordless logins. Sources: [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), [Securing the Data API](https://supabase.com/docs/guides/api/securing-your-api), and [Passwordless email logins](https://supabase.com/docs/guides/auth/auth-email-passwordless). The [Supabase changelog](https://supabase.com/changelog) was also reviewed before this design.

## Application changes

- Extract catalog validation and operational-record creation from `src/app/orders/actions.ts` so signed-in orders and claimed guest requests use the same pricing and status rules.
- Add a reusable guest contact form to office, mailbox, and service pages. When a session exists, keep the current streamlined signed-in form.
- Add a request-received page that explains what was saved, what is pending, and how to resend an activation link without exposing whether an account already exists.
- Extend `/auth/confirm` to allow only validated relative `next` paths, then route the customer to the activation handler. This also closes the current open-redirect risk from accepting an arbitrary `next` URL.
- Add an admin “Service signups” queue showing new, activation-sent, converted, and email-failed requests. Staff can contact a customer or close a duplicate, but cannot see or resend any token.
- Send two independent notifications after the database save: an immediate office intake email and the customer's Magic Link. Email failure changes the intake status and leaves the saved request available for staff follow-up.

## Failure handling

- Database failure: show a retryable error and do not claim the request was received.
- Office notification failure: keep the request saved, record a notification failure, and surface it in the admin queue.
- Magic Link failure: keep the request saved, show the reference, offer a resend action, and alert staff.
- Expired link: authenticate normally, then offer to send a fresh link for the same unclaimed request.
- Duplicate submit or repeated callback: return the original safe result through the idempotency key and conversion marker.
- Catalog price or availability changed before activation: stop conversion and send the customer to a clear staff-review state instead of silently changing the order.

## Security and abuse controls

- Normalize and validate email and US phone formats on the server; clamp every string and JSON field.
- Do not use the submitted email alone to attach data. Require the authenticated Supabase user, a verified email match, the unguessable request ID, the same tenant, an unexpired claim, and an unclaimed row.
- Use a neutral response for activation/resend so account existence is not disclosed.
- Add a honeypot and durable per-IP-hash/per-email-hash throttling. Store only salted hashes for throttling, not raw IP addresses.
- Configure only the production origin and approved preview origins in Supabase's redirect allowlist.
- Add database tests proving `anon` and ordinary `authenticated` users cannot select, insert, update, or delete intake rows or execute conversion; staff access is tenant-scoped; service-role conversion is idempotent.

## Verification

- Unit tests for contact validation, phone normalization, price/date validation, safe relative redirects, and idempotency.
- Database tests for grants, RLS allow/deny cases, cross-tenant denial, expired claims, email mismatch, double conversion, and atomic rollback.
- Integration tests for each of the three guest request types and the existing signed-in paths.
- Browser checks on phone and desktop widths: submit without a login, receive the confirmation state, use the Magic Link, see the converted request in the dashboard, and confirm staff receives the intake.
- Production smoke test with a disposable customer address, followed by deletion or closure of the test request.

## Out of scope

- Taking card payment before account activation.
- Guaranteeing office availability at initial guest submission.
- Replacing the existing check-payment and staff-confirmation workflows.
- Automatically merging records solely because two submissions use the same email address.
