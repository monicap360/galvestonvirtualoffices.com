import fs from "node:fs";
import assert from "node:assert/strict";

const defaults = fs.readFileSync("src/lib/ai-studio/defaults.ts", "utf8");
const config = fs.readFileSync("src/lib/ai-studio/config.ts", "utf8");

const slugs = [
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

for (const slug of slugs) {
  assert.ok(defaults.includes(`\"${slug}\"`), `missing defaults for ${slug}`);
}

assert.ok(defaults.includes("follow_up_cadence"), "appointment setter should ship with follow-up defaults");
assert.ok(defaults.includes("after_hours"), "phone attendant should ship with after-hours defaults");
assert.ok(defaults.includes("large_party_threshold"), "restaurant host should ship with large-party defaults");
assert.ok(defaults.includes("reminder_timing"), "event promoter should ship with reminder defaults");
assert.ok(defaults.includes("unsubscribe_handling"), "schedule filler should ship with opt-out defaults");
assert.ok(defaults.includes("reminder_cadence"), "dental front desk should ship with reminder defaults");
assert.ok(defaults.includes("workflowSteps"), "each agent should ship with a visible workflow blueprint");
assert.ok(config.includes("getAgentWorkflowDefaults"), "new-agent config must apply prebuilt workflow defaults");
assert.ok(config.includes("createDefaultAgentConfig"), "new-agent setup must have a dedicated default seeding path");

console.log("ai-agent-defaults: ok");
