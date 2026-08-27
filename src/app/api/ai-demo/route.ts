import Anthropic from "@anthropic-ai/sdk";
import {
  DEMO_MODEL,
  TRIAL_MESSAGE_LIMIT,
  MAX_MESSAGE_CHARS,
  MAX_COMPANY_CHARS,
  MAX_WHAT_CHARS,
  MAX_AGENT_FIELD_CHARS,
  buildSystemPrompt,
  buildAgentDemoPrompt,
  normalizeDemoHistory,
  type ChatTurn,
} from "@/lib/ai/agent";
import { buildDemoFallbackResponse } from "@/lib/ai/demo-fallback";

export const runtime = "nodejs";

type Body = {
  // "Build your agent" demo (/ai-assistant):
  company?: string;
  whatTheyDo?: string;
  // Specific AI Studio agent demo (/ai-studio):
  agent?: { name?: string; tagline?: string; description?: string };
  history?: ChatTurn[];
  mode?: "intro" | "chat";
};

function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return bad(
      "The AI demo isn't switched on yet. (Add your ANTHROPIC_API_KEY to enable it.)",
      503
    );
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return bad("Invalid request.");
  }

  const history = normalizeDemoHistory(Array.isArray(body.history) ? body.history : []);
  const isIntro = body.mode === "intro";

  // Two flavors of demo: a specific AI Studio agent (role-play), or the
  // "build your own assistant" flow keyed to the visitor's business.
  const clip = (v: unknown, n: number) => String(v || "").trim().slice(0, n);
  let system: string;
  let introInstruction: string;

  if (body.agent && body.agent.name) {
    const name = clip(body.agent.name, MAX_COMPANY_CHARS);
    const tagline = clip(body.agent.tagline, MAX_AGENT_FIELD_CHARS);
    const description = clip(body.agent.description, MAX_AGENT_FIELD_CHARS);
    system = buildAgentDemoPrompt(name, tagline, description);
    introInstruction =
      "A prospective customer just opened your live demo. Greet them in character and start doing your job in 2 short sentences, then invite them to try you out.";
  } else {
    const company = clip(body.company, MAX_COMPANY_CHARS);
    const whatTheyDo = clip(body.whatTheyDo, MAX_WHAT_CHARS);
    if (!company || !whatTheyDo) return bad("Tell us your company name and what you do first.");
    system = buildSystemPrompt(company, whatTheyDo);
    introInstruction =
      "A visitor just opened the chat on your website. In 2 short sentences, greet them warmly as the assistant, show you understand what the business does, and invite them to ask a question.";
  }

  // Enforce the free-trial cap (count the customer's own messages).
  const customerTurns = history.filter((m) => m.role === "user").length;
  if (!isIntro && customerTurns > TRIAL_MESSAGE_LIMIT) {
    return Response.json({ limitReached: true });
  }

  // Build the conversation for Claude, clamping length/size for cost + safety.
  const turns = history
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.text === "string")
    .slice(-2 * TRIAL_MESSAGE_LIMIT)
    .map((m) => ({
      role: m.role,
      content: m.text.slice(0, MAX_MESSAGE_CHARS),
    }));

  // On intro, seed a single instruction so the agent opens the conversation.
  const messages =
    isIntro && turns.length === 0
      ? [{ role: "user" as const, content: introInstruction }]
      : turns;

  if (messages.length === 0) return bad("Nothing to respond to.");
  if (messages[0].role !== "user") return bad("Conversation must start with a customer message.");

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model: DEMO_MODEL,
      max_tokens: 600,
      // Snappy, low-cost replies for a customer-facing FAQ bot.
      output_config: { effort: "low" },
      system,
      messages,
    });

    const reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    return Response.json({ reply: reply || "Sorry — could you say that another way?" });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return bad("We're getting a lot of interest right now — try again in a moment.", 429);
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return bad("The AI demo key looks invalid. Please check your ANTHROPIC_API_KEY.", 503);
    }
    console.error("[ai-demo] provider request failed; serving fallback", err);
    return buildDemoFallbackResponse({
      agentName: clip(body.agent?.name || body.company || "AI Assistant", MAX_COMPANY_CHARS),
      tagline: clip(body.agent?.tagline || body.whatTheyDo || "", MAX_AGENT_FIELD_CHARS),
      history,
      mode: isIntro ? "intro" : "chat",
    });
  }
}
