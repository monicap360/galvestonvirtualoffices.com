import { z } from "zod";
import { getAgentWorkflowDefaults } from "./defaults";
import { getAgentTemplate } from "./templates";
import type { AgentConfigValue, AgentField, ConnectionState } from "./types";

export type { AgentConfigValue } from "./types";

export type AgentConfigV1 = {
  schema_version: 1;
  business: {
    name: string;
    industry: string;
    website?: string;
    timezone: string;
  };
  identity: {
    display_name: string;
    tone: "warm-professional" | "friendly" | "direct" | "luxury";
    languages: string[];
    greeting?: string;
  };
  capabilities: Record<string, AgentConfigValue>;
  connections: Record<string, { state: ConnectionState }>;
  setup: {
    readiness: number;
    blocking_items: string[];
    recommended_items: string[];
  };
};

export type ReadinessResult = {
  score: number;
  label: "Setup Needed" | "Almost Ready" | "Ready to Review" | "Ready";
  blockingItems: string[];
  recommendedItems: string[];
};

type NormalizeOptions = {
  trustedConnections?: Record<string, { state?: ConnectionState }>;
};

const toneSchema = z.enum(["warm-professional", "friendly", "direct", "luxury"]);
const urlSchema = z.string().url();

function readPath(raw: unknown, path: string): unknown {
  if (!raw || typeof raw !== "object") return undefined;
  const parts = path.split(".");
  let current: unknown = raw;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function hasValue(value: AgentConfigValue | undefined): boolean {
  if (Array.isArray(value)) return value.some((item) => item.trim().length > 0);
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;
  return false;
}

function normalizeString(value: unknown, field: AgentField): string | undefined {
  if (value == null || value === "") return undefined;
  const text = String(value).trim();
  if (!text) return undefined;
  const clamped = field.maxLength ? text.slice(0, field.maxLength) : text;
  if (field.type === "url") return urlSchema.parse(clamped);
  if (field.type === "select" && field.options?.length) {
    const allowed = new Set(field.options.map((option) => option.value));
    if (!allowed.has(clamped)) throw new Error(`Invalid option for ${field.key}`);
  }
  return clamped;
}

function normalizeFieldValue(value: unknown, field: AgentField): AgentConfigValue | undefined {
  if (field.type === "number") {
    if (value == null || value === "") return undefined;
    const parsed = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(parsed)) throw new Error(`Invalid number for ${field.key}`);
    return parsed;
  }

  if (field.type === "toggle") {
    if (value == null || value === "") return undefined;
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "1" || value === "on") return true;
    if (value === "false" || value === "0" || value === "off") return false;
    throw new Error(`Invalid toggle for ${field.key}`);
  }

  if (field.type === "multiselect") {
    if (value == null || value === "") return undefined;
    const items = Array.isArray(value)
      ? value.map((item) => String(item).trim()).filter(Boolean)
      : String(value).split(",").map((item) => item.trim()).filter(Boolean);
    if (field.options?.length) {
      const allowed = new Set(field.options.map((option) => option.value));
      for (const item of items) {
        if (!allowed.has(item)) throw new Error(`Invalid option for ${field.key}`);
      }
    }
    return items;
  }

  return normalizeString(value, field);
}

function fieldValueFromConfig(config: AgentConfigV1, field: AgentField): AgentConfigValue | undefined {
  if (field.key === "business.name") return config.business.name;
  if (field.key === "business.industry") return config.business.industry;
  if (field.key === "business.website") return config.business.website;
  if (field.key === "business.timezone") return config.business.timezone;
  if (field.key === "identity.display_name") return config.identity.display_name;
  if (field.key === "identity.tone") return config.identity.tone;
  if (field.key === "identity.languages") return config.identity.languages;
  if (field.key === "identity.greeting") return config.identity.greeting;
  if (field.key.startsWith("capabilities.")) return config.capabilities[field.key.slice("capabilities.".length)];
  return undefined;
}

export function computeAgentReadiness(slug: string, config: AgentConfigV1): ReadinessResult {
  const template = getAgentTemplate(slug);
  if (!template) throw new Error(`Unknown AI agent slug: ${slug}`);

  const requiredFields = template.sections.flatMap((section) => section.fields).filter((field) => field.required);
  const recommendedFields = template.sections.flatMap((section) => section.fields).filter((field) => !field.required);
  const blockingConnections = template.connections.filter((connection) => connection.blocking);
  const recommendedConnections = template.connections.filter((connection) => !connection.blocking);

  const blockingItems: string[] = [];
  const recommendedItems: string[] = [];

  let requiredTotal = 0;
  let requiredDone = 0;
  for (const field of requiredFields) {
    const weight = field.readinessWeight ?? 1;
    requiredTotal += weight;
    if (hasValue(fieldValueFromConfig(config, field))) requiredDone += weight;
    else blockingItems.push(field.label);
  }
  for (const connection of blockingConnections) {
    requiredTotal += 5;
    if (config.connections[connection.key]?.state === "connected") requiredDone += 5;
    else blockingItems.push(connection.label);
  }

  let recommendedTotal = 0;
  let recommendedDone = 0;
  for (const field of recommendedFields) {
    const weight = field.readinessWeight ?? 1;
    recommendedTotal += weight;
    if (hasValue(fieldValueFromConfig(config, field))) recommendedDone += weight;
    else recommendedItems.push(field.label);
  }
  for (const connection of recommendedConnections) {
    recommendedTotal += 2;
    if (config.connections[connection.key]?.state === "connected") recommendedDone += 2;
    else recommendedItems.push(connection.label);
  }

  const requiredRatio = requiredTotal === 0 ? 1 : requiredDone / requiredTotal;
  const recommendedRatio = recommendedTotal === 0 ? 1 : recommendedDone / recommendedTotal;
  const score = Math.max(0, Math.min(100, Math.round(requiredRatio * 80 + recommendedRatio * 20)));
  const label: ReadinessResult["label"] =
    score < 40 ? "Setup Needed" : score < 80 ? "Almost Ready" : score < 100 ? "Ready to Review" : "Ready";

  return { score, label, blockingItems, recommendedItems };
}

export function normalizeAgentConfig(slug: string, raw: unknown, options: NormalizeOptions = {}): AgentConfigV1 {
  const template = getAgentTemplate(slug);
  if (!template) throw new Error(`Unknown AI agent slug: ${slug}`);

  const capabilities: Record<string, AgentConfigValue> = {};
  let businessName = "";
  let businessIndustry = template.vertical;
  let businessWebsite: string | undefined;
  let displayName = template.defaultDisplayName;
  let tone: AgentConfigV1["identity"]["tone"] = "warm-professional";
  let languages = ["en"];
  let greeting: string | undefined;

  for (const field of template.sections.flatMap((section) => section.fields)) {
    const normalized = normalizeFieldValue(readPath(raw, field.key), field);
    if (normalized === undefined) continue;

    if (field.key === "business.name") businessName = String(normalized);
    else if (field.key === "business.industry") businessIndustry = String(normalized);
    else if (field.key === "business.website") businessWebsite = String(normalized);
    else if (field.key === "identity.display_name") displayName = String(normalized);
    else if (field.key === "identity.tone") tone = toneSchema.parse(normalized);
    else if (field.key === "identity.languages") languages = Array.isArray(normalized) ? normalized.map(String) : [String(normalized)];
    else if (field.key === "identity.greeting") greeting = String(normalized);
    else if (field.key.startsWith("capabilities.")) capabilities[field.key.slice("capabilities.".length)] = normalized;
  }

  const timezoneRaw = readPath(raw, "business.timezone");
  const timezone = typeof timezoneRaw === "string" && timezoneRaw.trim() ? timezoneRaw.trim().slice(0, 80) : "America/Chicago";

  const connections: AgentConfigV1["connections"] = {};
  for (const requirement of template.connections) {
    const trusted = options.trustedConnections?.[requirement.key]?.state;
    connections[requirement.key] = {
      state: trusted === "connected" ? "connected" : requirement.blocking ? "needs_setup" : "not_connected",
    };
  }

  const provisional: AgentConfigV1 = {
    schema_version: 1,
    business: {
      name: businessName,
      industry: businessIndustry,
      ...(businessWebsite ? { website: businessWebsite } : {}),
      timezone,
    },
    identity: {
      display_name: displayName,
      tone,
      languages,
      ...(greeting ? { greeting } : {}),
    },
    capabilities,
    connections,
    setup: {
      readiness: 0,
      blocking_items: [],
      recommended_items: [],
    },
  };

  const readiness = computeAgentReadiness(slug, provisional);
  provisional.setup = {
    readiness: readiness.score,
    blocking_items: readiness.blockingItems,
    recommended_items: readiness.recommendedItems,
  };

  return provisional;
}

export function createDefaultAgentConfig(slug: string): AgentConfigV1 {
  const template = getAgentTemplate(slug);
  if (!template) throw new Error(`Unknown AI agent slug: ${slug}`);

  const capabilities = getAgentWorkflowDefaults(slug);
  return normalizeAgentConfig(slug, {
    business: {
      industry: template.vertical,
      timezone: "America/Chicago",
    },
    identity: {
      display_name: template.defaultDisplayName,
      tone: "warm-professional",
      languages: ["en"],
    },
    capabilities,
  });
}

export function buildPreviewSummary(slug: string, config: AgentConfigV1): string {
  const template = getAgentTemplate(slug);
  if (!template) throw new Error(`Unknown AI agent slug: ${slug}`);

  const capabilityLines = Object.entries(config.capabilities)
    .filter(([, value]) => hasValue(value))
    .slice(0, 20)
    .map(([key, value]) => `${key.replaceAll("_", " ")}: ${Array.isArray(value) ? value.join(", ") : String(value)}`);

  return [
    `Business: ${config.business.name || "Not provided"}`,
    `Industry: ${config.business.industry}`,
    `Agent name: ${config.identity.display_name}`,
    `Tone: ${config.identity.tone}`,
    `Languages: ${config.identity.languages.join(", ")}`,
    config.identity.greeting ? `Greeting: ${config.identity.greeting}` : "",
    capabilityLines.length ? `Configured rules:\n${capabilityLines.join("\n")}` : "",
    template.complianceNote ? `Compliance note: ${template.complianceNote}` : "",
    "Any phone, calendar, CRM, ordering, ticketing, email, social, insurance, booking, or other external system that is not explicitly connected must be treated as unavailable in this preview.",
  ]
    .filter(Boolean)
    .join("\n");
}
