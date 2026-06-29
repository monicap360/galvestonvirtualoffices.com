"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTenant } from "@/lib/tenant";
import { getProfile } from "@/lib/session";

function dollarsToCents(raw: string): number | null {
  const n = parseFloat(raw.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) : null;
}

// Client submits a request for a managed VA (public; links to account if logged in).
export async function submitClientRequest(formData: FormData) {
  const tenant = await getTenant();
  if (!tenant) redirect("/virtual-assistants/request?error=1");
  const supabase = await createClient();
  const { user } = await getProfile();

  const hoursRaw = String(formData.get("hours_per_week") || "").trim();
  const budgetRaw = String(formData.get("budget") || "").trim();

  await supabase.from("client_requests").insert({
    tenant_id: tenant.id,
    user_id: user?.id ?? null,
    business_name: String(formData.get("business_name") || "") || null,
    contact_name: String(formData.get("contact_name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || "") || null,
    summary: String(formData.get("summary") || ""),
    skills_needed: String(formData.get("skills_needed") || "") || null,
    hours_per_week: hoursRaw ? parseInt(hoursRaw, 10) : null,
    budget_cents: budgetRaw ? dollarsToCents(budgetRaw) : null,
    status: "new",
  });

  redirect("/virtual-assistants/request?sent=1");
}

// VA applies to join the roster (public).
export async function submitAssistantApplication(formData: FormData) {
  const tenant = await getTenant();
  if (!tenant) redirect("/virtual-assistants/apply?error=1");
  const supabase = await createClient();

  const rateRaw = String(formData.get("desired_rate") || "").trim();

  await supabase.from("assistant_applications").insert({
    tenant_id: tenant.id,
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || "") || null,
    skills: String(formData.get("skills") || ""),
    experience: String(formData.get("experience") || "") || null,
    availability: String(formData.get("availability") || "") || null,
    desired_rate_cents: rateRaw ? dollarsToCents(rateRaw) : null,
    bio: String(formData.get("bio") || "") || null,
    links: String(formData.get("links") || "") || null,
    status: "applied",
  });

  redirect("/virtual-assistants/apply?sent=1");
}
