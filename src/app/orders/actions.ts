"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/session";
import { makeReference } from "@/lib/format";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

// Create a pay-by-check invoice tied to an order. Returns the new invoice id.
async function createInvoice(
  supabase: SupabaseClient,
  args: {
    tenantId: string; userId: string; amountCents: number; description: string;
    relatedType: string; relatedId: string;
  }
): Promise<string | null> {
  const { data } = await supabase
    .from("invoices")
    .insert({
      tenant_id: args.tenantId,
      user_id: args.userId,
      reference: makeReference(),
      description: args.description,
      amount_cents: args.amountCents,
      payment_method: "check",
      status: "awaiting_payment",
      related_type: args.relatedType,
      related_id: args.relatedId,
    })
    .select("id")
    .single();
  return data?.id ?? null;
}

function daysBetween(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(ms / 86_400_000) + 1);
}

// ---- Office booking ----
export async function createBooking(formData: FormData) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const officeId = String(formData.get("office_id") || "");
  const start = String(formData.get("start_date") || "");
  const end = String(formData.get("end_date") || "");
  if (!officeId || !start || !end) redirect("/offices?error=missing");

  const { data: office } = await supabase
    .from("offices")
    .select("id, name, price_per_day_cents")
    .eq("id", officeId)
    .single();
  if (!office) redirect("/offices?error=notfound");

  const total = daysBetween(start, end) * office.price_per_day_cents;

  const { data: booking } = await supabase
    .from("bookings")
    .insert({
      tenant_id: profile.tenant_id, user_id: profile.id, office_id: officeId,
      start_date: start, end_date: end, total_cents: total, status: "pending",
    })
    .select("id")
    .single();
  if (!booking) redirect("/offices?error=failed");

  const invoiceId = await createInvoice(supabase, {
    tenantId: profile.tenant_id, userId: profile.id, amountCents: total,
    description: `Office booking — ${office.name}`, relatedType: "booking", relatedId: booking.id,
  });
  redirect(invoiceId ? `/dashboard/invoices/${invoiceId}` : "/dashboard/bookings");
}

// ---- Virtual mailbox subscription ----
export async function subscribeMailbox(formData: FormData) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const planId = String(formData.get("plan_id") || "");
  if (!planId) redirect("/mailboxes?error=missing");

  const { data: plan } = await supabase
    .from("mailbox_plans")
    .select("id, name, price_cents")
    .eq("id", planId)
    .single();
  if (!plan) redirect("/mailboxes?error=notfound");

  const mailboxNumber = `GVO-${1000 + ((globalThis.crypto.getRandomValues(new Uint32Array(1))[0]) % 9000)}`;

  const { data: sub } = await supabase
    .from("mailbox_subscriptions")
    .insert({
      tenant_id: profile.tenant_id, user_id: profile.id, plan_id: planId,
      mailbox_number: mailboxNumber, status: "pending",
    })
    .select("id")
    .single();
  if (!sub) redirect("/mailboxes?error=failed");

  const invoiceId = await createInvoice(supabase, {
    tenantId: profile.tenant_id, userId: profile.id, amountCents: plan.price_cents,
    description: `Virtual mailbox — ${plan.name} (first month)`, relatedType: "subscription", relatedId: sub.id,
  });
  redirect(invoiceId ? `/dashboard/invoices/${invoiceId}` : "/dashboard/mailbox");
}

// ---- Service order (marketing assistant / web platform / bundle) ----
export async function orderService(formData: FormData) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const serviceId = String(formData.get("service_id") || "");
  if (!serviceId) redirect("/services/marketing?error=missing");

  const { data: service } = await supabase
    .from("services")
    .select("id, name, category, base_price_cents")
    .eq("id", serviceId)
    .single();
  if (!service) redirect("/services/marketing?error=notfound");

  // Collect free-form customization answers.
  const config: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (k.startsWith("cfg_")) config[k.slice(4)] = String(v);
  }

  // Web-platform builds are quoted first; everything else can pay now.
  const quoteOnly = service.category === "web_platform";

  const { data: order } = await supabase
    .from("service_orders")
    .insert({
      tenant_id: profile.tenant_id, user_id: profile.id, service_id: serviceId,
      status: quoteOnly ? "inquiry" : "active", config,
    })
    .select("id")
    .single();
  if (!order) redirect("/services/marketing?error=failed");

  if (quoteOnly || service.base_price_cents === 0) {
    revalidatePath("/dashboard/orders");
    redirect("/dashboard/orders?submitted=1");
  }

  const invoiceId = await createInvoice(supabase, {
    tenantId: profile.tenant_id, userId: profile.id, amountCents: service.base_price_cents,
    description: `Service — ${service.name}`, relatedType: "service_order", relatedId: order.id,
  });
  redirect(invoiceId ? `/dashboard/invoices/${invoiceId}` : "/dashboard/orders");
}

// ---- Public contact form ----
export async function submitContact(formData: FormData) {
  const supabase = await createClient();
  const { getTenant } = await import("@/lib/tenant");
  const tenant = await getTenant();
  if (!tenant) redirect("/contact?error=1");

  await supabase.from("contact_messages").insert({
    tenant_id: tenant.id,
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || "") || null,
    subject: String(formData.get("subject") || "") || null,
    message: String(formData.get("message") || ""),
  });
  redirect("/contact?sent=1");
}
