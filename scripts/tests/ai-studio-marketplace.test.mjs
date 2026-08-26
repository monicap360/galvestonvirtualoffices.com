import fs from "node:fs";
import assert from "node:assert/strict";

const page = fs.readFileSync("src/app/ai-studio/page.tsx", "utf8");
const card = fs.readFileSync("src/app/ai-studio/agent-card.tsx", "utf8");

assert.ok(page.includes("Choose a prebuilt AI employee"), "marketplace hero must sell the prebuilt-agent concept");
assert.ok(card.includes("Try live demo"), "cards must keep the live demo action");
assert.ok(card.includes("Customize &amp; Subscribe") || card.includes("Customize & Subscribe"), "cards must route customers into customization");
assert.ok(card.includes("/ai-studio/${service.slug}/customize"), "cards must use the canonical service slug");
assert.ok(!page.includes('name="cfg_business_name"'), "marketplace must not use the old one-field subscribe form");

console.log("ai-studio-marketplace: ok");
