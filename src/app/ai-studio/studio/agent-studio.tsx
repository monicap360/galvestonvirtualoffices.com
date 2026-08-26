"use client";

import { useMemo, useState } from "react";
import { createAiAgentOrder, updateAiAgentConfig } from "@/app/ai-studio/actions";
import { computeAgentReadiness, normalizeAgentConfig, type AgentConfigV1, type AgentConfigValue } from "@/lib/ai-studio/config";
import type { AgentField, AgentTemplate } from "@/lib/ai-studio/types";
import FieldRenderer from "./field-renderer";
import ReadinessMeter from "./readiness-meter";
import ConnectionTile from "./connection-tile";

type ServiceSummary = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  base_price_cents: number;
  interval: string | null;
  features: string[];
};

type Props = {
  service: ServiceSummary;
  template: AgentTemplate;
  initialConfig: AgentConfigV1;
  mode?: "create" | "edit";
  orderId?: string;
};

function readPath(config: AgentConfigV1, key: string): AgentConfigValue | undefined {
  const parts = key.split(".");
  let current: unknown = config;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current as AgentConfigValue | undefined;
}

function setPath(config: AgentConfigV1, key: string, value: AgentConfigValue | undefined) {
  const draft = structuredClone(config) as unknown as Record<string, unknown>;
  const parts = key.split(".");
  let current = draft;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    if (!current[part] || typeof current[part] !== "object") current[part] = {};
    current = current[part] as Record<string, unknown>;
  }
  const leaf = parts.at(-1)!;
  if (value === undefined || value === "") delete current[leaf];
  else current[leaf] = value;
  return draft;
}

function fieldValue(config: AgentConfigV1, field: AgentField) {
  return readPath(config, field.key);
}

function formatPrice(cents: number, interval: string | null) {
  const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
  return interval ? `${dollars}/${interval === "month" ? "mo" : interval}` : dollars;
}

export default function AgentStudio({ service, template, initialConfig, mode = "create", orderId }: Props) {
  const [config, setConfig] = useState(initialConfig);
  const [activeSection, setActiveSection] = useState(template.sections[0]?.id ?? "identity");

  const readiness = useMemo(() => computeAgentReadiness(service.slug, config), [service.slug, config]);
  const currentSection = template.sections.find((section) => section.id === activeSection) ?? template.sections[0];
  const action = mode === "edit" ? updateAiAgentConfig : createAiAgentOrder;

  function updateField(field: AgentField, value: AgentConfigValue | undefined) {
    const raw = setPath(config, field.key, value);
    const trustedConnections = Object.fromEntries(
      Object.entries(config.connections).filter(([, state]) => state.state === "connected"),
    );
    setConfig(normalizeAgentConfig(service.slug, raw, { trustedConnections }));
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 rounded-full bg-cyan-400/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,.8)]" />
              Agent Studio · configuration mode
            </div>
            <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-[-0.035em] text-white sm:text-5xl">{service.name}</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">{service.description}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-left lg:text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Plan</p>
            <p className="mt-1 text-2xl font-black text-white">{formatPrice(service.base_price_cents, service.interval)}</p>
            <p className="mt-1 text-xs text-slate-500">Configure first. Activation follows real setup and payment.</p>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,.65fr)]">
          <form action={action} className="min-w-0">
            <input type="hidden" name="service_id" value={service.id} />
            <input type="hidden" name="service_slug" value={service.slug} />
            <input type="hidden" name="config_json" value={JSON.stringify(config)} />
            {orderId && <input type="hidden" name="order_id" value={orderId} />}

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <nav className="flex gap-2 overflow-x-auto border-b border-white/10 p-3" aria-label="Agent setup sections">
                {template.sections.map((section) => {
                  const active = section.id === currentSection.id;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${active ? "bg-violet-400/15 text-violet-100 shadow-inner shadow-violet-300/5" : "text-slate-500 hover:bg-white/[0.03] hover:text-white"}`}
                    >
                      {section.title}
                    </button>
                  );
                })}
                <span className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500">Connections</span>
                <span className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500">Preview</span>
              </nav>

              <div className="p-5 sm:p-7">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">{currentSection.id === "identity" ? "Agent Identity" : "Capabilities"}</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">{currentSection.title}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{currentSection.description}</p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {currentSection.fields.map((field) => (
                    <div key={field.key} className={field.type === "textarea" || field.type === "multiselect" || field.type === "toggle" ? "sm:col-span-2" : ""}>
                      <FieldRenderer field={field} value={fieldValue(config, field)} onChange={(value) => updateField(field, value)} />
                    </div>
                  ))}
                </div>

                {template.complianceNote && (
                  <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4 text-sm leading-6 text-cyan-50/80">
                    {template.complianceNote}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-500">Your setup is saved to one canonical AI service order. No duplicate agent account is created.</p>
                <button className="btn-primary shrink-0 px-6 py-3">
                  {mode === "edit" ? "Save Configuration" : "Customize & Continue"}
                </button>
              </div>
            </div>
          </form>

          <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
            <div className="overflow-hidden rounded-3xl border border-violet-300/15 bg-gradient-to-br from-violet-500/10 via-slate-950/85 to-cyan-400/5 p-5 shadow-2xl shadow-violet-950/20">
              <div className="flex items-center gap-3">
                <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-xl font-black text-violet-100">
                  {config.identity.display_name.slice(0, 1).toUpperCase() || "A"}
                  <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-amber-300" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Digital employee</p>
                  <p className="text-lg font-bold text-white">{config.identity.display_name || template.defaultDisplayName}</p>
                  <p className="text-xs text-amber-200">Preview / setup mode</p>
                </div>
              </div>
              <p className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm leading-6 text-slate-300">
                {config.business.name ? `${config.identity.display_name || template.defaultDisplayName} is being configured for ${config.business.name}.` : "Add your business details to personalize this agent."}
              </p>
            </div>

            <ReadinessMeter readiness={readiness} />

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Connections</p>
                  <h2 className="mt-1 text-lg font-semibold text-white">Live systems</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-500">Truthful status</span>
              </div>
              <div className="mt-4 space-y-3">
                {template.connections.map((connection) => (
                  <ConnectionTile
                    key={connection.key}
                    label={connection.label}
                    description={connection.description}
                    state={config.connections[connection.key]?.state ?? "not_connected"}
                    blocking={connection.blocking}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Preview</p>
              <h2 className="mt-1 text-lg font-semibold text-white">See your agent in action</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Your configured preview will appear here. It will use your business details without pretending unconnected systems are live.</p>
              <div className="mt-4 grid gap-2">
                {template.samplePrompts.map((prompt) => (
                  <div key={prompt} className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5 text-xs text-slate-400">“{prompt}”</div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
