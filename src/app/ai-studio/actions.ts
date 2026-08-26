"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/session";
import { makeReference } from "@/lib/format";
import { normalizeAgentConfig, type AgentConfigV1 } from "@/lib/ai-studio/config";

function parseConfigJson(value: FormDataEntryValue | null): unknown {
  if (typeof value !== "string" || !value.trim()) return {};
  try {
    return JSON.parse(value);
  } catch {
    throw new Error("Invalid AI agent configuration payload");
  }
}

function trustedConnectionsFromExisting(config: unknown): AgentConfigV1["connections"] {
  if (!config || typeof config !== "object") return {};
  const connections = (config as Record<string, unknown>).connections;
  if (!connections || typeof connections !== "object") return {};

  const trusted: AgentConfigV1["connections"] = {};
  for (const [key, value] of Object.entries(connections as Record<string, unknown>)) {
    if (!value || typeof value !== "object") continue;
    const state = (value as Record<string, unknown>).state;
    if (state === "connected") trusted[key] = { state: "connected" };
  }
  return trusted;
}

export async function createAiAgentOrder(formData: FormData) {
  const profile = await requireProfile("/ai-studio");
  const supabase = await createClient();

  const serviceId = String(formData.get("service_id") || "");
  const serviceSlug = String(formData.get("service_slug") || "");
  if (!serviceId || !serviceSlug) redirect("/ai-studio?error=missing-agent");

  const { data: service } = await supabase
    .from("services")
    .select("id, slug, name, category, base_price_cents, interval, active")
    .eq("id", serviceId)
    .eq("slug", serviceSlug)
    .eq("category", "ai_product")
    .eq("active", true)
    .single();

  if (!service) redirect("/ai-studio?error=agent-not-found");

  let config: AgentConfigV1;
  try {
    config = normalizeAgentConfig(service.slug, parseConfigJson(formData.get("config_json")));
  } catch {
    redirect(`/ai-studio/${encodeURIComponent(service.slug)}/customize?error=invalid-config`);
  }

  const { data: order } = await supabase
    .from("service_orders")
    .insert({
      tenant_id: profile.tenant_id,
      user_id: profile.id,
      service_id: service.id,
      status: "inquiry",
      config,
      quoted_price_cents: service.base_price_cents,
    })
    .select("id")
    .single();

  if (!order) redirect(`/ai-studio/${encodeURIComponent(service.slug)}/customize?error=save-failed`);

  await supabase.from("invoices").insert({
    tenant_id: profile.tenant_id,
    user_id: profile.id,
    reference: makeReference(),
    description: `${service.name} — first month`,
    amount_cents: service.base_price_cents,
    payment_method: "check",
    status: "awaiting_payment",
    related_type: "service_order",
    related_id: order.id,
  });

  redirect(`/dashboard/agents/${order.id}?started=1`);
}

export async function updateAiAgentConfig(formData: FormData) {
  const profile = await requireProfile("/dashboard/agents");
  const supabase = await createClient();

  const orderId = String(formData.get("order_id") || "");
  const submittedSlug = String(formData.get("service_slug") || "");
  if (!orderId || !submittedSlug) redirect("/dashboard/agents?error=missing-agent");

  const { data: order } = await supabase
    .from("service_orders")
    .select("id, config, service_id, services(slug, category)")
    .eq("id", orderId)
    .eq("user_id", profile.id)
    .single();

  const service = order?.services as unknown as { slug: string; category: string } | null;
  if (!order || !service || service.category !== "ai_product" || service.slug !== submittedSlug) {
    redirect("/dashboard/agents?error=not-found");
  }

  const trustedConnections = trustedConnectionsFromExisting(order.config);

  let config: AgentConfigV1;
  try {
    config = normalizeAgentConfig(service.slug, parseConfigJson(formData.get("config_json")), {
      trustedConnections,
    });
  } catch {
    redirect(`/dashboard/agents/${orderId}?error=invalid-config`);
  }

  const { error } = await supabase
    .from("service_orders")
    .update({ config })
    .eq("id", orderId)
    .eq("user_id", profile.id);

  if (error) redirect(`/dashboard/agents/${orderId}?error=save-failed`);
  redirect(`/dashboard/agents/${orderId}?saved=1`);
}
