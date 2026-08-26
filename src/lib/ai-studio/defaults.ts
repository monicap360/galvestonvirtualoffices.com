import type { AiAgentSlug } from "./templates";
import type { AgentConfigValue } from "./types";

export type AgentDefaults = {
  capabilities: Record<string, AgentConfigValue>;
  workflowSteps: string[];
};

export const AGENT_DEFAULTS: Record<AiAgentSlug, AgentDefaults> = {
  "ai-appointment-setter-email": {
    capabilities: {
      meeting_length: 30,
      follow_up_cadence: "Follow up after 1 day, 3 days, and 7 days unless the lead replies or opts out.",
      max_follow_ups: 4,
      stop_conditions: "Stop when the lead replies, books, declines, or asks not to be contacted.",
    },
    workflowSteps: [
      "Receive or import an approved lead",
      "Send personalized outreach in the business voice",
      "Qualify interest with the configured questions",
      "Handle scheduling back-and-forth",
      "Book to the connected calendar",
      "Log the result and stop follow-up when the lead resolves",
    ],
  },
  "ai-phone-attendant": {
    capabilities: {
      after_hours: "Answer politely, capture the caller's name, number, reason for calling, and urgency, then follow the configured escalation rule.",
      appointment_behavior: "Offer appointment booking only when a real scheduling destination is connected; otherwise collect the preferred date/time for staff follow-up.",
    },
    workflowSteps: [
      "Answer every call with the configured greeting",
      "Identify the caller's intent",
      "Route, answer FAQs, or collect details",
      "Book only through a connected scheduling system",
      "Escalate urgent calls using the configured rule",
      "Create a concise call summary for the business",
    ],
  },
  "ai-restaurant-host": {
    capabilities: {
      large_party_threshold: 8,
      unavailable_item_policy: "Apologize, explain that the item is unavailable, and offer configured alternatives without inventing inventory.",
      order_handoff: "Collect the order accurately and use the connected ordering destination; if none is connected, clearly state that staff confirmation is required.",
    },
    workflowSteps: [
      "Answer menu, hours, location, and policy questions",
      "Determine whether the guest wants takeout, a reservation, catering, or information",
      "Collect order or reservation details",
      "Use the connected ordering/reservation system when available",
      "Escalate large parties and catering inquiries by rule",
      "Confirm exactly what was submitted versus what still needs staff confirmation",
    ],
  },
  "ai-tour-seller": {
    capabilities: {
      group_rates: "Mention group pricing only when a configured group-rate rule exists; otherwise offer to collect the group details for staff review.",
      upsells: "Recommend relevant add-ons only from the configured tour and add-on list.",
    },
    workflowSteps: [
      "Understand the guest's date, group size, interests, and timing",
      "Recommend only configured tours",
      "Explain pickup, age, cancellation, and meeting rules",
      "Check live availability only when a real feed is connected",
      "Send the guest to the connected booking destination",
      "Offer configured add-ons or group options without inventing pricing",
    ],
  },
  "ai-airbnb-reservations": {
    capabilities: {
      early_late_rules: "Treat early check-in and late checkout as requests unless the configured rules explicitly allow automatic approval.",
      review_timing: "Request a review 24 hours after checkout unless the guest has an unresolved issue.",
    },
    workflowSteps: [
      "Identify the property and reservation context",
      "Answer house-rule, access, parking, and check-in questions",
      "Handle routine pre-arrival and stay questions",
      "Treat availability and reservation changes as live only when a booking/PMS connection exists",
      "Escalate emergencies to the configured contact",
      "Follow up after checkout using the configured review timing",
    ],
  },
  "ai-event-promoter": {
    capabilities: {
      campaign_channels: ["email", "social"],
      reminder_timing: "Send reminders 7 days before, 24 hours before, and 2 hours before the event when the required campaign channels are connected.",
      post_event_follow_up: "Thank attendees after the event and promote the next configured event or offer.",
    },
    workflowSteps: [
      "Learn the active event, audience, ticket link, and access rules",
      "Create campaign messages for approved channels",
      "Answer event questions using configured facts",
      "Drive buyers to the real ticket destination",
      "Promote configured VIP/table options",
      "Run reminder and post-event follow-up sequences only on connected channels",
    ],
  },
  "ai-schedule-filler": {
    capabilities: {
      outreach_channels: ["email", "sms"],
      allowed_hours: "Contact customers only during the business's configured local outreach hours.",
      recall_cadence: "Start with one outreach, follow up once after 48 hours, and stop after the configured maximum or any opt-out.",
      unsubscribe_handling: "Stop immediately when a customer opts out or asks not to be contacted, and preserve that stop state for future campaigns.",
    },
    workflowSteps: [
      "Use only the approved eligible customer/lead source",
      "Find open or cancelled appointment slots",
      "Contact eligible people during allowed hours",
      "Offer only real available slots from a connected calendar",
      "Stop on booking, decline, or opt-out",
      "Summarize bookings and outreach results for the business",
    ],
  },
  "ai-marketing-manager": {
    capabilities: {
      posting_frequency: "Default plan: 3 social posts per week, 1 local SEO/content item per month, and 1 promotional campaign per month; customize to the business's capacity.",
      offer_rules: "Never invent discounts, deadlines, guarantees, pricing, or claims. Promote only offers explicitly approved in the configuration.",
    },
    workflowSteps: [
      "Use the configured audience, service area, offers, and brand voice",
      "Plan a rolling content calendar",
      "Draft social, local SEO, review, and campaign content",
      "Require a real connection before publishing or sending",
      "Track approved campaign priorities",
      "Produce a concise monthly performance summary from real available data",
    ],
  },
  "ai-legal-intake": {
    capabilities: {
      disqualification_rules: "Do not promise representation or legal outcomes. Collect facts, apply only configured screening rules, and route uncertain matters to staff.",
      conflict_questions: "Collect names of relevant parties for a preliminary conflict pre-check without stating that a formal conflict check is complete.",
    },
    workflowSteps: [
      "Identify the prospective client's matter and practice area",
      "Collect the configured intake facts",
      "Run only the configured preliminary screening questions",
      "Flag urgent matters using configured triggers",
      "Route to the correct attorney/team or consultation path",
      "Never provide legal advice or promise representation",
    ],
  },
  "ai-dental-front-desk": {
    capabilities: {
      reminder_cadence: "Default reminders: 48 hours and 24 hours before the appointment, subject to the practice's communication rules.",
      recall_cadence: "Default recall sequence: initial reminder, one follow-up after 7 days, then route to staff or stop according to practice policy.",
      no_show_handling: "Acknowledge the missed appointment, offer the connected scheduling path, and apply only the practice's configured no-show policy.",
      insurance_workflow: "Collect insurer and member details for the configured workflow. Do not state eligibility is verified unless a real eligibility system returns that result.",
    },
    workflowSteps: [
      "Answer routine practice, service, location, and hours questions",
      "Determine whether the patient is new or existing",
      "Schedule only through a connected practice scheduling system",
      "Collect configured new-patient information",
      "Run reminders and recalls according to practice policy",
      "Treat insurance eligibility as unverified until a real verification workflow confirms it",
    ],
  },
};

export function getAgentDefaults(slug: string): AgentDefaults | null {
  return (AGENT_DEFAULTS as Record<string, AgentDefaults>)[slug] ?? null;
}

export function getAgentWorkflowDefaults(slug: string): Record<string, AgentConfigValue> {
  return { ...(getAgentDefaults(slug)?.capabilities ?? {}) };
}
