import assert from "node:assert/strict";
import test from "node:test";

import { buildSystemPrompt, MAX_WHAT_CHARS } from "../src/lib/ai/agent.ts";
import { buildDemoFallbackReply } from "../src/lib/ai/demo-fallback.ts";

test("Ava receives enough business knowledge and explicit anti-repetition rules", () => {
  assert.ok(MAX_WHAT_CHARS >= 1000);
  const prompt = buildSystemPrompt("Island Tax", "Tax preparation and bookkeeping");
  assert.match(prompt, /use the full conversation/i);
  assert.match(prompt, /never repeat/i);
  assert.match(prompt, /ask only one/i);
});

test("fallback does not repeat its previous answer", () => {
  const repeated = "I can take care of that. What name, contact information, and timing should I use to complete the request?";
  const reply = buildDemoFallbackReply({
    agentName: "Ava",
    tagline: "business assistant",
    mode: "chat",
    history: [
      { role: "user", text: "I need help scheduling something." },
      { role: "assistant", text: repeated },
      { role: "user", text: "I'd like to schedule it." },
    ],
  });

  assert.notEqual(reply, repeated);
  assert.match(reply, /what.*schedule|service|appointment/i);
});

test("fallback answers a service question before requesting contact details", () => {
  const reply = buildDemoFallbackReply({
    agentName: "Ava",
    tagline: "virtual office, mailbox, meeting rooms, and AI business support",
    mode: "chat",
    history: [{ role: "user", text: "What services do you offer?" }],
  });

  assert.match(reply, /virtual office|mailbox|meeting room|AI business support/i);
  assert.doesNotMatch(reply, /name, contact information, and timing/i);
});
