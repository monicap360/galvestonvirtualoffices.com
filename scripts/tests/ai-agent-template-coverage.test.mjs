import fs from "node:fs";
import assert from "node:assert/strict";

const templates = fs.readFileSync("src/lib/ai-studio/templates.ts", "utf8");
const types = fs.readFileSync("src/lib/ai-studio/types.ts", "utf8");

const expected = [
  "ai-appointment-setter-email",
  "ai-phone-attendant",
  "ai-restaurant-host",
  "ai-tour-seller",
  "ai-airbnb-reservations",
  "ai-event-promoter",
  "ai-schedule-filler",
  "ai-marketing-manager",
  "ai-legal-intake",
  "ai-dental-front-desk",
];

for (const slug of expected) {
  assert.ok(templates.includes(`slug: "${slug}"`), `missing template for ${slug}`);
}

assert.ok(templates.includes("export const AGENT_TEMPLATES"), "template registry must be exported");
assert.ok(templates.includes("export function getAgentTemplate"), "registry lookup must be exported");
assert.ok(templates.includes("samplePrompts:"), "templates must include sample prompts");
assert.ok(templates.includes("required: true"), "templates must include blocking required fields");
assert.ok(types.includes("ConnectionState"), "shared connection state type must exist");
assert.ok(types.includes('"not_connected" | "needs_setup" | "connected"'), "connection states must be truthful and explicit");

console.log("ai-agent-template-coverage: ok");
