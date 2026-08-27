import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/session";
import { computeAgentReadiness, normalizeAgentConfig, type AgentConfigV1 } from "@/lib/ai-studio/config";
import AgentStatusCard from "./agent-status-card";

export const metadata = { title: "My AI Agents" };

function trustedConnections(config: unknown) {
  if (!config || typeof config !== "object") return {};
  const connections = (config as { connections?: AgentConfigV1["connections"] }).connections;
  if (!connections) return {};
  return Object.fromEntries(Object.entries(connections).filter(([, value]) => value?.state === "connected"));
}

export default async function MyAiAgentsPage() {
  const profile = await requireProfile("/dashboard/agents");
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("service_orders")
    .select("id, status, config, created_at, services!inner(slug, name, category)")
    .eq("user_id", profile.id)
    .eq("services.category", "ai_product")
    .order("created_at", { ascending: false });

  const agents = (orders ?? [])
    .map((order) => {
      const service = order.services as unknown as { slug: string; name: string; category: string } | null;
      if (!service) return null;
      try {
        const config = normalizeAgentConfig(service.slug, order.config, { trustedConnections: trustedConnections(order.config) });
        return {
          order,
          service,
          config,
          readiness: computeAgentReadiness(service.slug, config),
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Array<{
      order: { id: string; status: string; config: unknown; created_at: string };
      service: { slug: string; name: string; category: string };
      config: AgentConfigV1;
      readiness: ReturnType<typeof computeAgentReadiness>;
    }>;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">AI workforce</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">My AI Agents</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Configure, preview, and finish the real connections your digital employees need before they go live.</p>
        </div>
        <Link href="/ai-studio" className="btn-primary">Add AI agent</Link>
      </div>

      {agents.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center">
          <p className="text-lg font-semibold text-white">No AI agents yet.</p>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">Choose a prebuilt digital employee, customize it for your business, and preview it before setup continues.</p>
          <Link href="/ai-studio" className="btn-primary mt-5 inline-flex">Browse AI Studio</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5">
          {agents.map(({ order, service, config, readiness }) => (
            <AgentStatusCard
              key={order.id}
              orderId={order.id}
              serviceName={service.name}
              businessName={config.business.name}
              orderStatus={order.status}
              readiness={readiness}
              createdAt={order.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
