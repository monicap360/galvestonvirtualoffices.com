import fs from "node:fs";
import assert from "node:assert/strict";

const page = fs.readFileSync("src/app/ai-studio/[slug]/customize/page.tsx", "utf8");
const studio = fs.readFileSync("src/app/ai-studio/studio/agent-studio.tsx", "utf8");
const readiness = fs.readFileSync("src/app/ai-studio/studio/readiness-meter.tsx", "utf8");
const connections = fs.readFileSync("src/app/ai-studio/studio/connection-tile.tsx", "utf8");

assert.ok(page.includes("notFound"), "unknown agent slugs must 404");
for (const label of ["Agent Identity", "Capabilities", "Connections", "Readiness", "Preview"]) {
  assert.ok(studio.includes(label), `studio must surface ${label}`);
}
assert.ok(studio.includes("Customize & Continue"), "pre-purchase CTA must be truthful");
assert.ok(readiness.includes("readiness"), "readiness meter must render the computed score");
assert.ok(connections.includes("Not connected") && connections.includes("Needs setup") && connections.includes("Connected"), "connections must use explicit truthful states");

console.log("ai-agent-studio-ui: ok");
