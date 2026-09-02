import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const fallback = await import("../src/lib/ai/demo-fallback.ts");
const contactDetails = fallback;

test("Ava recognizes common US phone-number formats", () => {
  assert.equal(
    typeof contactDetails.extractPhoneNumber,
    "function",
    "the AI demo must provide deterministic phone-number recognition",
  );

  for (const input of [
    "4094027908",
    "(409) 402-7908",
    "409-402-7908",
    "+1 409 402 7908",
  ]) {
    assert.equal(contactDetails.extractPhoneNumber(input), "(409) 402-7908");
  }
  assert.equal(contactDetails.extractPhoneNumber("tomorrow at 4:09"), null);
});

test("Ava remembers a phone number from earlier customer turns", () => {
  assert.equal(
    contactDetails.extractKnownPhone?.([
      { role: "user", text: "My number is 409-402-7908" },
      { role: "assistant", text: "Thanks. What day works?" },
      { role: "user", text: "Tomorrow afternoon" },
    ]),
    "(409) 402-7908",
  );
});

test("the provider prompt receives deterministic known-contact context", () => {
  const history = [{ role: "user", text: "Call me on 409.402.7908" }];
  const context = contactDetails.buildKnownContactContext?.(history) || "";
  const routeSource = fs.readFileSync(
    new URL("../src/app/api/ai-demo/route.ts", import.meta.url),
    "utf8",
  );

  assert.match(context, /Phone: \(409\) 402-7908/);
  assert.match(context, /do not ask.*repeat/i);
  assert.match(
    routeSource,
    /buildKnownContactContext\(history\)/,
    "the live model path must receive the recognized contact details",
  );
});

test("the fallback acknowledges a supplied phone number instead of asking for it again", () => {
  const reply = fallback.buildDemoFallbackReply({
    agentName: "Island Grill Restaurant",
    tagline: "restaurant reservations and to-go orders",
    mode: "chat",
    history: [
      { role: "assistant", text: "What phone number should I use?" },
      { role: "user", text: "+1 409 402 7908" },
    ],
  });

  assert.match(reply, /\(409\) 402-7908/);
  assert.doesNotMatch(reply, /what.*phone|phone number should/i);
});

test("the fallback does not re-request a phone number supplied earlier", () => {
  const reply = fallback.buildDemoFallbackReply({
    agentName: "Island Grill Restaurant",
    tagline: "restaurant reservations and to-go orders",
    mode: "chat",
    history: [
      { role: "user", text: "Use 4094027908" },
      { role: "assistant", text: "What day works?" },
      { role: "user", text: "Tomorrow" },
    ],
  });

  assert.doesNotMatch(reply, /what.*phone|phone number should/i);
});
