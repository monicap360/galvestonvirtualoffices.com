import fs from "node:fs";
import assert from "node:assert/strict";

const actions = fs.readFileSync("src/app/ai-studio/actions.ts", "utf8");

assert.ok(actions.includes("createAiAgentOrder"), "create action must exist");
assert.ok(actions.includes("updateAiAgentConfig"), "update action must exist");
assert.ok(actions.includes("requireProfile"), "actions must require authentication");
assert.ok(actions.includes('.eq("category", "ai_product")'), "create action must only accept AI products");
assert.ok(actions.includes("normalizeAgentConfig"), "config must be normalized server-side");
assert.ok(actions.includes('status: "inquiry"'), "new AI orders must not claim active before payment/setup");
assert.ok(actions.includes('.eq("user_id", profile.id)'), "update action must enforce ownership");
assert.ok(!actions.includes('formData.get("price'), "price must never be accepted from FormData");
assert.ok(!actions.includes('formData.get("tenant'), "tenant must never be accepted from FormData");
assert.ok(!actions.includes('formData.get("user'), "user ownership must never be accepted from FormData");

console.log("ai-agent-actions: ok");
