import fs from "node:fs";
import assert from "node:assert/strict";

const render = fs.readFileSync("render.yaml", "utf8");
const route = fs.readFileSync("src/app/api/ai-demo/route.ts", "utf8");

assert.ok(route.includes("process.env.ANTHROPIC_API_KEY"), "AI demo route must require Anthropic API key from environment");
assert.ok(render.includes("ANTHROPIC_API_KEY"), "Render must declare ANTHROPIC_API_KEY as a service environment variable");
assert.ok(/ANTHROPIC_API_KEY[\s\S]*sync:\s*false/.test(render), "Anthropic API key must stay private and be supplied through Render");

console.log("ai-demo-render-key: ok");
