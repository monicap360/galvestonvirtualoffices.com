import assert from "node:assert/strict";
import test from "node:test";

import { buildSystemPrompt } from "../src/lib/ai/agent.ts";
import { buildDemoFallbackReply } from "../src/lib/ai/demo-fallback.ts";
import { SHOWCASE_PROFILES } from "../src/lib/ai/showcase-profiles.ts";

test("showcase includes nine complete business demonstrations", () => {
  assert.equal(SHOWCASE_PROFILES.length, 9);
  for (const id of ["airbnb", "hotel", "website-sales", "website-support"]) {
    assert.ok(SHOWCASE_PROFILES.some((profile) => profile.id === id));
  }
  for (const profile of SHOWCASE_PROFILES) {
    assert.ok(profile.company.length > 3);
    assert.match(profile.knowledge, /Services:/);
    assert.match(profile.knowledge, /Hours:/);
    assert.match(profile.knowledge, /Sample pricing:/);
    assert.match(profile.knowledge, /Policies:/);
    assert.ok(profile.questions.length >= 3);
    assert.deepEqual(profile.actions.map((action) => action.kind), ["answer", "recommend", "complete"]);
  }
});

test("action prompts produce useful showcase outcomes", () => {
  const profile = SHOWCASE_PROFILES[0];
  const recommendation = buildDemoFallbackReply({
    agentName: profile.company,
    tagline: profile.knowledge,
    mode: "chat",
    history: [{ role: "user", text: profile.actions[1].prompt }],
  });
  const completion = buildDemoFallbackReply({
    agentName: profile.company,
    tagline: profile.knowledge,
    mode: "chat",
    history: [{ role: "user", text: profile.actions[2].prompt }],
  });
  assert.match(recommendation, /recommend|best fit/i);
  assert.match(completion, /start|next step|need/i);
  assert.doesNotMatch(completion, /submitted|confirmed|completed/i);
});

test("hotel fallback handles room availability without inventing inventory", () => {
  const profile = SHOWCASE_PROFILES.find((item) => item.id === "hotel");
  const reply = buildDemoFallbackReply({
    agentName: profile.company,
    tagline: profile.knowledge,
    mode: "chat",
    history: [{ role: "user", text: "Do you have an accessible king room Friday night?" }],
  });
  assert.match(reply, /dates|availability|accessible/i);
  assert.doesNotMatch(reply, /yes, we have/i);
});

test("website sales fallback qualifies the project", () => {
  const profile = SHOWCASE_PROFILES.find((item) => item.id === "website-sales");
  const reply = buildDemoFallbackReply({
    agentName: profile.company,
    tagline: profile.knowledge,
    mode: "chat",
    history: [{ role: "user", text: "I need a website for my new business" }],
  });
  assert.match(reply, /business|website|goal/i);
  assert.match(reply, /\?/);
});

test("website support fallback triages an outage", () => {
  const profile = SHOWCASE_PROFILES.find((item) => item.id === "website-support");
  const reply = buildDemoFallbackReply({
    agentName: profile.company,
    tagline: profile.knowledge,
    mode: "chat",
    history: [{ role: "user", text: "My website is completely down" }],
  });
  assert.match(reply, /urgent|outage|down/i);
  assert.match(reply, /address|URL|domain/i);
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
