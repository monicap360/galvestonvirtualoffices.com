import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTenant } from "@/lib/tenant";
import { getAgentTemplate } from "@/lib/ai-studio/templates";
import { normalizeAgentConfig } from "@/lib/ai-studio/config";
import AgentStudio from "@/app/ai-studio/studio/agent-studio";

export const metadata = { title: "Customize AI Agent" };

export default async function CustomizeAiAgentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = getAgentTemplate(slug);
  if (!template) notFound();

  const tenant = await getTenant();
  if (!tenant) notFound();

  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("id, slug, name, tagline, description, base_price_cents, interval, features, category, active")
    .eq("tenant_id", tenant.id)
    .eq("slug", slug)
    .eq("category", "ai_product")
    .eq("active", true)
    .single();

  if (!service) notFound();

  const initialConfig = normalizeAgentConfig(slug, {
    business: { industry: template.vertical, timezone: "America/Chicago" },
    identity: { display_name: template.defaultDisplayName, tone: "warm-professional", languages: ["en"] },
  });

  return (
    <AgentStudio
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
      initialConfig={initialConfig}
    />
  );
}
