import fs from "node:fs";
import assert from "node:assert/strict";

const config = fs.readFileSync("src/lib/ai-studio/config.ts", "utf8");

assert.ok(config.includes("schema_version: 1"), "schema version must be server controlled");
assert.ok(config.includes("normalizeAgentConfig"), "config normalizer must exist");
assert.ok(config.includes("computeAgentReadiness"), "readiness engine must exist");
assert.ok(config.includes("buildPreviewSummary"), "preview summarizer must exist");
assert.ok(config.includes("trustedConnections"), "connected state must require trusted server-side state");
assert.ok(config.includes("z.string().url()"), "URL fields must be validated");
assert.ok(config.includes("Unknown AI agent slug"), "unsupported slugs must be rejected");
assert.ok(!config.includes("price_cents:"), "customer config must not carry canonical price");
assert.ok(!config.includes("user_id:"), "customer config must not carry canonical user ownership");

console.log("ai-agent-config: ok");
