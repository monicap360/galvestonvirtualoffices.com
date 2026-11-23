"use server";

import { z } from "zod";
import { price } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { getTenant } from "@/lib/tenant";

export type GuestSignupState = { reference?: string; error?: string };

const signup = z.object({
  plan: z.uuid(),
  amount: z.string().regex(/^\d{1,10}$/),
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
  phone: z.string().trim().max(40),
});

export async function requestMailboxSignup(_state: GuestSignupState, form: FormData): Promise<GuestSignupState> {
  if (form.get("website")) return { error: "We couldn’t accept your request. Please try again." };
  const input = signup.safeParse({
    plan: form.get("plan"),
    amount: form.get("amount"),
    name: form.get("name"),
    email: String(form.get("email") ?? "").trim(),
    phone: form.get("phone") ?? "",
  });
  if (!input.success) return { error: "Check your plan selection and contact details, then try again." };

  const tenant = await getTenant();
  if (!tenant) return { error: "Signup is temporarily unavailable. Please try again later." };
  const supabase = await createClient();
  const { data: plan, error: planError } = await supabase.from("mailbox_plans")
    .select("id, name, price_cents, interval")
    .eq("tenant_id", tenant.id)
    .eq("active", true)
    .eq("id", input.data.plan)
    .maybeSingle();
  if (planError) return { error: "We couldn’t check your plan. Please try again." };
  if (!plan || plan.price_cents !== Number(input.data.amount)) {
    return { error: "This plan or its price has changed. Go back to the mailbox plans and select it again." };
  }

  const reference = `GVO-${crypto.randomUUID().slice(0, 12).replace("-", "").toUpperCase()}`;
  const { error } = await supabase.from("contact_messages").insert({
    tenant_id: tenant.id,
    name: input.data.name,
    email: input.data.email,
    phone: input.data.phone || null,
    subject: `Guest mailbox signup · ${reference}`,
    message: `${plan.name} · ${price(plan.price_cents, plan.interval)}\nPlan ID: ${plan.id}\nPending staff review and first invoice.`,
  });
  if (error) return { error: "Your signup couldn’t be saved. Please try again or contact us." };
  return { reference };
}
