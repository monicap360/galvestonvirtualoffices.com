import assert from "node:assert/strict";
import fs from "node:fs";

import {
  buildDemoFallbackReply,
  buildDemoFallbackResponse,
} from "../../src/lib/ai/demo-fallback.ts";
import { normalizeDemoHistory } from "../../src/lib/ai/agent.ts";

assert.deepEqual(
  normalizeDemoHistory([
    { role: "assistant", text: "Welcome!" },
    { role: "user", text: "I need an appointment." },
    { role: "assistant", text: "What day works?" },
  ]),
  [
    { role: "user", text: "I need an appointment." },
    { role: "assistant", text: "What day works?" },
  ],
  "chat history must discard the modal greeting so Anthropic receives a user-first conversation",
);

const phoneIntro = buildDemoFallbackReply({
  agentName: "AI Phone Line & Auto-Attendant",
  tagline: "A 24/7 AI phone line that answers every call.",
  history: [],
  mode: "intro",
});

assert.match(phoneIntro, /thank you for calling/i, "phone demo fallback must open like a real receptionist");
assert.doesNotMatch(phoneIntro, /snag|error|unavailable/i, "fallback must not expose provider failures");

const restaurantReply = buildDemoFallbackReply({
  agentName: "AI Restaurant Host & To-Go",
  tagline: "Takes to-go orders and reservations, 24/7.",
  history: [{ role: "user", text: "I need a table for four Friday at 7." }],
  mode: "chat",
});

assert.match(restaurantReply, /name/i, "restaurant demo fallback must continue the reservation workflow");
assert.match(restaurantReply, /phone/i, "restaurant demo fallback must capture a callback number");

const genericReply = buildDemoFallbackReply({
  agentName: "AI Event Promoter",
  tagline: "Promotes events and follows up with guests.",
  history: [{ role: "user", text: "Can you promote my grand opening?" }],
  mode: "chat",
});

assert.ok(genericReply.length > 20, "every listed agent must have a useful fallback reply");
assert.doesNotMatch(genericReply, /snag|error|unavailable/i, "generic fallback must stay customer-facing");

assert.doesNotThrow(() =>
  buildDemoFallbackReply({
    agentName: "AI Phone Line & Auto-Attendant",
    tagline: "Answers calls.",
    history: [{ role: "user", text: 3 }],
    mode: "chat",
  }),
  "malformed browser history must not turn a provider failure into an HTTP 500",
);

const response = buildDemoFallbackResponse({
  agentName: "AI Phone Line & Auto-Attendant",
  tagline: "Answers calls.",
  history: [],
  mode: "intro",
});
assert.equal(response.status, 200, "unexpected provider failures must return HTTP 200");
const payload = await response.json();
assert.equal(payload.fallback, true, "the API must mark provider fallback replies");
assert.match(payload.reply, /thank you for calling/i, "the API fallback payload must contain a usable reply");

const route = fs.readFileSync("src/app/api/ai-demo/route.ts", "utf8");
assert.ok(
  route.includes("return buildDemoFallbackResponse({"),
  "the unexpected-provider catch must directly return the tested fallback response",
);
assert.ok(!route.includes("The assistant hit a snag"), "the API must never restore the customer-facing 502 message");

console.log("ai-demo-fallback: ok");
