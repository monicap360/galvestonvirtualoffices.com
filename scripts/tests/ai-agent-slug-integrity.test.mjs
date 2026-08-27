import fs from "node:fs";
import assert from "node:assert/strict";

const templates = fs.readFileSync("src/lib/ai-studio/templates.ts", "utf8");
const migrations = [
  fs.readFileSync("supabase/migrations/0004_ai_products.sql", "utf8"),
  fs.readFileSync("supabase/migrations/0006_focused_ai_agents.sql", "utf8"),
  fs.readFileSync("supabase/migrations/0007_phone_line_and_retire_vas.sql", "utf8"),
].join("\n");

const expectedActive = [
  "ai-airbnb-reservations",
  "ai-appointment-setter-email",
  "ai-dental-front-desk",
  "ai-event-promoter",
  "ai-legal-intake",
  "ai-marketing-manager",
  "ai-phone-attendant",
  "ai-restaurant-host",
  "ai-schedule-filler",
  "ai-tour-seller",
];

for (const slug of expectedActive) {
  assert.ok(templates.includes(`slug: "${slug}"`), `registry missing ${slug}`);
  assert.ok(migrations.includes(`'${slug}'`), `catalog history missing ${slug}`);
}

for (const retired of ["ai-receptionist", "ai-speed-to-lead", "ai-review-manager", "ai-social-manager", "ai-content-seo", "ai-knowledge", "ai-full-employee"]) {
  assert.ok(migrations.includes(retired), `retired product history missing ${retired}`);
}

console.log("ai-agent-slug-integrity: ok");
