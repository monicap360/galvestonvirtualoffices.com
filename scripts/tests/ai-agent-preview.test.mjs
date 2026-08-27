import fs from "node:fs";
import assert from "node:assert/strict";

const route = fs.readFileSync("src/app/api/ai-demo/route.ts", "utf8");
const preview = fs.readFileSync("src/app/ai-studio/studio/preview-panel.tsx", "utf8");

assert.ok(route.includes("configurationSummary?: string"), "preview API must accept sanitized configuration context");
assert.ok(route.includes("MAX_CONFIGURATION_SUMMARY_CHARS"), "configuration context must be length clamped");
assert.ok(route.includes("Unconnected external systems are not live"), "preview prompt must explicitly preserve integration truthfulness");
assert.ok(preview.includes("Preview"), "preview panel must be clearly labeled");
assert.ok(preview.includes("samplePrompts"), "preview panel must expose vertical sample prompts");
assert.ok(preview.includes("configurationSummary"), "preview request must include current sanitized configuration");

console.log("ai-agent-preview: ok");
