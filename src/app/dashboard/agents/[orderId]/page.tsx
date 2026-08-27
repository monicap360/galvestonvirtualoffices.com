import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/session";
import { getAgentTemplate } from "@/lib/ai-studio/templates";
import { normalizeAgentConfig, type AgentConfigV1 } from "@/lib/ai-studio/config";
import AgentStudio from "@/app/ai-studio/studio/agent-studio";

export const metadata = { title: "Configure AI Agent" };

function trustedConnections(config: unknown) {
  if (!config || typeof config !== "object") return {};
  const connections = (config as { connections?: AgentConfigV1["connections"] }).connections;
  if (!connections) return {};
  return Object.fromEntries(Object.entries(connections).filter(([, value]) => value?.state === "connected"));
}

export default async function OwnedAiAgentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const profile = await requireProfile(`/dashboard/agents/${orderId}`);
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("service_orders")
    .select("id, config, service_id, services!inner(id, slug, name, tagline, description, base_price_cents, interval, features, category, active)")
    .eq("id", orderId)
    .eq("user_id", profile.id)
    .eq("services.category", "ai_product")
    .single();

  const service = order?.services as unknown as {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    description: string;
    base_price_cents: number;
    interval: string | null;
    features: string[];
    category: string;
    active: boolean;
  } | null;

  if (!order || !service) notFound();
  const template = getAgentTemplate(service.slug);
  if (!template) notFound();

  const config = normalizeAgentConfig(service.slug, order.config, {
    trustedConnections: trustedConnections(order.config),
  });

  return (
    <AgentStudio
      mode="edit"
      orderId={order.id}
      service={{
        id: service.id,
        slug: service.slug,
        name: service.name,
        tagline: service.tagline,
        description: service.description,
        base_price_cents: service.base_price_cents,
        interval: service.interval,
        features: service.features,
      }}
      template={template}
      initialConfig={config}
    />
  );
}
