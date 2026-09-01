import assert from "node:assert/strict";
import test from "node:test";

import { buildSystemPrompt } from "../src/lib/ai/agent.ts";
import { buildDemoFallbackReply } from "../src/lib/ai/demo-fallback.ts";
import { SHOWCASE_PROFILES } from "../src/lib/ai/showcase-profiles.ts";

test("showcase includes five complete business demonstrations", () => {
  assert.equal(SHOWCASE_PROFILES.length, 5);
  for (const profile of SHOWCASE_PROFILES) {
    assert.ok(profile.company.length > 3);
    assert.match(profile.knowledge, /Services:/);
    assert.match(profile.knowledge, /Hours:/);
    assert.match(profile.knowledge, /Sample pricing:/);
    assert.match(profile.knowledge, /Policies:/);
    assert.ok(profile.questions.length >= 3);
  }
});

test("showcase prompt makes Ava demonstrate expertise and sales judgment", () => {
  const profile = SHOWCASE_PROFILES[0];
  const prompt = buildSystemPrompt(profile.company, profile.knowledge);
  assert.match(prompt, /recommend the best fit/i);
  assert.match(prompt, /handle objections/i);
  assert.match(prompt, /knowledge provided/i);
  assert.match(prompt, /concrete next step/i);
});

test("fallback can quote known showcase pricing", () => {
  const profile = SHOWCASE_PROFILES[0];
  const reply = buildDemoFallbackReply({
    agentName: profile.company,
    tagline: profile.knowledge,
    mode: "chat",
    history: [{ role: "user", text: "How much is a virtual mailbox?" }],
  });
  assert.match(reply, /\$49/);
  assert.match(reply, /mailbox/i);
});

test("fallback handles objections with a useful answer", () => {
  const profile = SHOWCASE_PROFILES[0];
  const reply = buildDemoFallbackReply({
    agentName: profile.company,
    tagline: profile.knowledge,
    mode: "chat",
    history: [{ role: "user", text: "Why shouldn't I just use a PO box?" }],
  });
  assert.match(reply, /street address|professional address/i);
  assert.doesNotMatch(reply, /contact information and timing/i);
});
