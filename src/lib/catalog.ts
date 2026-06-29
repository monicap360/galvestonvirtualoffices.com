import { createClient } from "@/lib/supabase/server";
import { getTenant } from "@/lib/tenant";

export type Office = {
  id: string; name: string; slug: string; description: string; type: string;
  capacity: number; size_sqft: number | null;
  price_per_day_cents: number; price_per_month_cents: number | null; image_url: string | null;
};

export type MailboxPlan = {
  id: string; name: string; slug: string; description: string;
  price_cents: number; interval: string; features: string[];
};

export type Service = {
  id: string; name: string; slug: string;
  category: "marketing_assistant" | "web_platform" | "bundle" | "virtual_assistant";
  tagline: string; description: string; base_price_cents: number; interval: string | null; features: string[];
};

export type Assistant = {
  id: string; name: string; headline: string; bio: string;
  skills: string[]; hourly_rate_cents: number; availability: string | null; photo_url: string | null;
};

export async function getAssistants(): Promise<Assistant[]> {
  const tenant = await getTenant();
  if (!tenant) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("assistants")
    .select("id, name, headline, bio, skills, hourly_rate_cents, availability, photo_url")
    .eq("tenant_id", tenant.id)
    .eq("active", true)
    .order("created_at");
  return (data as Assistant[]) ?? [];
}

export async function getOffices(): Promise<Office[]> {
  const tenant = await getTenant();
  if (!tenant) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("offices")
    .select("*")
    .eq("tenant_id", tenant.id)
    .eq("active", true)
    .order("price_per_day_cents");
  return (data as Office[]) ?? [];
}

export async function getMailboxPlans(): Promise<MailboxPlan[]> {
  const tenant = await getTenant();
  if (!tenant) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("mailbox_plans")
    .select("*")
    .eq("tenant_id", tenant.id)
    .eq("active", true)
    .order("price_cents");
  return (data as MailboxPlan[]) ?? [];
}

export type ServiceCategory = Service["category"];

export async function getServices(category?: Service["category"]): Promise<Service[]> {
  const tenant = await getTenant();
  if (!tenant) return [];
  const supabase = await createClient();
  let q = supabase.from("services").select("*").eq("tenant_id", tenant.id).eq("active", true);
  if (category) q = q.eq("category", category);
  const { data } = await q.order("base_price_cents");
  return (data as Service[]) ?? [];
}
