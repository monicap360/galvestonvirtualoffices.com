import fs from "node:fs";
import assert from "node:assert/strict";

const page = fs.readFileSync("src/app/dashboard/agents/page.tsx", "utf8");
const detail = fs.readFileSync("src/app/dashboard/agents/[orderId]/page.tsx", "utf8");
const card = fs.readFileSync("src/app/dashboard/agents/agent-status-card.tsx", "utf8");
const layout = fs.readFileSync("src/app/dashboard/layout.tsx", "utf8");

assert.ok(page.includes("My AI Agents"), "dashboard must have a dedicated AI agents surface");
assert.ok(page.includes('services!inner'), "dashboard must join canonical service orders to AI products");
assert.ok(page.includes('.eq("user_id", profile.id)'), "dashboard must scope orders to current owner");
assert.ok(detail.includes('.eq("user_id", profile.id)'), "owned detail route must enforce ownership");
assert.ok(detail.includes('mode="edit"'), "owned detail must reuse the studio in edit mode");
for (const action of ["Customize", "Preview", "Connections"]) assert.ok(card.includes(action), `agent card must expose ${action}`);
assert.ok(layout.includes("/dashboard/agents"), "dashboard navigation must include My AI Agents");

console.log("my-ai-agents-dashboard: ok");
