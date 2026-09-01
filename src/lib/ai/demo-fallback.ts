type DemoFallbackInput = {
  agentName: string;
  tagline: string;
  history: unknown[];
  mode: "intro" | "chat";
};

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

function readKnowledgeSection(knowledge: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return knowledge.match(new RegExp(`${escaped}:\\s*(.*?)(?=\\s+[A-Z][A-Za-z ]+:|$)`, "i"))?.[1]?.trim() || "";
}

function relevantPricing(knowledge: string, message: string): string {
  const pricing = readKnowledgeSection(knowledge, "Sample pricing");
  if (!pricing) return "";
  const words = message.toLowerCase().split(/\W+/).filter((word) => word.length > 3);
  return pricing.split(";").find((item) => words.some((word) => item.toLowerCase().includes(word)))?.trim() || pricing;
}

/**
 * Keeps the public demo useful when the model provider is temporarily unable
 * to answer. These are intentionally short, in-character workflow replies.
 */
export function buildDemoFallbackReply({ agentName, tagline, history, mode }: DemoFallbackInput): string {
  const role = `${agentName} ${tagline}`.toLowerCase();

  if (mode === "intro") {
    if (includesAny(role, ["phone", "auto-attendant"])) {
      return "Thank you for calling! How may I help you today—would you like to book, place an order, or leave a message for the team?";
    }
    if (includesAny(role, ["restaurant", "to-go"])) {
      return "Welcome! I can help with a reservation, a to-go order, or a catering request. What can I arrange for you today?";
    }
    if (includesAny(role, ["tour", "excursion"])) {
      return "Welcome! Tell me your date, group size, and what kind of experience you want, and I’ll help you find the right tour.";
    }
    if (includesAny(role, ["airbnb", "reservation manager", "guest"])) {
      return "Welcome! I can help with availability, booking questions, or check-in details. What dates are you considering?";
    }
    if (includesAny(role, ["appointment", "schedule"])) {
      return "Hello! I can help find the right appointment time. What service do you need, and what day works best?";
    }
    if (includesAny(role, ["event", "promoter", "marketing"])) {
      return "Let’s get your event in front of the right people. What are you promoting, when is it, and who should attend?";
    }
    return `Hi! I'm ${agentName}. Tell me what you need help with, and I’ll show you how I would handle it for your business.`;
  }

  const lastMessage = [...history]
    .reverse()
    .find(
      (turn): turn is { role: "user"; text: string } =>
        typeof turn === "object" &&
        turn !== null &&
        "role" in turn &&
        turn.role === "user" &&
        "text" in turn &&
        typeof turn.text === "string",
    )
    ?.text.trim();
  const lastMessageLower = lastMessage?.toLowerCase() || "";
  const previousAssistantMessage = [...history]
    .reverse()
    .find(
      (turn): turn is { role: "assistant"; text: string } =>
        typeof turn === "object" &&
        turn !== null &&
        "role" in turn &&
        turn.role === "assistant" &&
        "text" in turn &&
        typeof turn.text === "string",
    )
    ?.text.trim();

  if (includesAny(lastMessageLower, ["what services", "services do", "what do you offer", "how can you help"])) {
    const services = readKnowledgeSection(tagline, "Services");
    return services
      ? `We can help with ${services}. Which service would you like details about?`
      : tagline.trim()
      ? `We can help with ${tagline.trim()}. Which service would you like details about?`
      : "I can answer questions, capture requests, help with scheduling, and connect you with the right person. What would you like help with first?";
  }

  if (includesAny(role, ["website support", "web care"]) && includesAny(lastMessageLower, ["site is down", "website is down", "completely down", "outage", "offline"])) {
    return "I’m treating this as an urgent website outage. What is the website address or domain so the support team can begin triage?";
  }

  if (includesAny(role, ["website sales", "web studio"]) && includesAny(lastMessageLower, ["need a website", "new website", "website for my", "build a website"])) {
    return "I can help recommend the right website package. What is the business, and what is the main result the website needs to produce—calls, bookings, sales, or leads?";
  }

  if (includesAny(role, ["hotel"]) && includesAny(lastMessageLower, ["room", "availability", "accessible", "stay", "night"])) {
    return "I can check the right room type without guessing at live inventory. What are your exact arrival and departure dates, and which accessible features do you need?";
  }

  if (includesAny(lastMessageLower, ["po box", "p.o. box"])) {
    return "A professional street address gives your business a more credible local presence than a PO box and can also include mail alerts and package receiving. Would you like the mailbox plan or the full business-address plan?";
  }

  if (includesAny(lastMessageLower, ["schedule", "appointment", "book", "reservation"])) {
    return "Of course. What service or appointment would you like to schedule?";
  }

  if (includesAny(lastMessageLower, ["price", "pricing", "cost", "how much"])) {
    const pricing = relevantPricing(tagline, lastMessageLower);
    return pricing
      ? `For this showcase, ${pricing}. The team will confirm the final quote—would you like to compare options or start a request?`
      : "I can help with pricing, but I need to know which service you’re considering first. Which service would you like a price for?";
  }

  if (includesAny(role, ["restaurant", "to-go"])) {
    return "Absolutely—I can help arrange that. What name and phone number should I use for the reservation or order?";
  }
  if (includesAny(role, ["phone", "auto-attendant"])) {
    return "I’d be happy to help. May I have your name, phone number, and the best details to pass along or use for your booking?";
  }
  if (includesAny(role, ["tour", "excursion"])) {
    return "Great choice. What date, group size, and preferred time should I check for you?";
  }
  if (includesAny(role, ["airbnb", "reservation manager", "guest"])) {
    return "I can help with that. What are your check-in and checkout dates, number of guests, and best contact number?";
  }
  if (includesAny(role, ["appointment", "schedule"])) {
    return "Let’s get that scheduled. What day and time range work best, and what name and phone number should I place on the appointment?";
  }
  if (includesAny(role, ["event", "promoter", "marketing"])) {
    return "Yes—I can build the promotion around your audience, date, offer, and booking link. What is the event date and the main action you want guests to take?";
  }

  const genericReply = lastMessage
    ? "I can help with that. What would you like me to handle first?"
    : `I'm ready to demonstrate ${agentName}. What would you like me to handle?`;

  if (previousAssistantMessage === genericReply || includesAny(lastMessageLower, ["yes", "sure", "i'd", "i would"])) {
    return "Let’s take it one step at a time. What specific service or task do you need help with?";
  }

  return genericReply;
}

export function buildDemoFallbackResponse(input: DemoFallbackInput): Response {
  return Response.json({
    reply: buildDemoFallbackReply(input),
    fallback: true,
  });
}
