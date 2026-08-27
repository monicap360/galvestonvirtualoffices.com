import type { AgentField, AgentTemplate } from "./types";

export const AI_AGENT_SLUGS = [
  "ai-appointment-setter-email",
  "ai-phone-attendant",
  "ai-restaurant-host",
  "ai-tour-seller",
  "ai-airbnb-reservations",
  "ai-event-promoter",
  "ai-schedule-filler",
  "ai-marketing-manager",
  "ai-legal-intake",
  "ai-dental-front-desk",
] as const;

export type AiAgentSlug = (typeof AI_AGENT_SLUGS)[number];

const toneOptions = [
  { label: "Warm & professional", value: "warm-professional" },
  { label: "Friendly", value: "friendly" },
  { label: "Direct", value: "direct" },
  { label: "Luxury / concierge", value: "luxury" },
];

const languageOptions = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
];

const commonIdentity = (vertical: string): AgentField[] => [
  {
    key: "business.name",
    label: "Business name",
    type: "text",
    placeholder: "Your business name",
    required: true,
    readinessWeight: 10,
    maxLength: 120,
  },
  {
    key: "business.website",
    label: "Website",
    type: "url",
    placeholder: "https://example.com",
    readinessWeight: 2,
    maxLength: 300,
  },
  {
    key: "business.industry",
    label: "Industry",
    type: "text",
    placeholder: vertical,
    required: true,
    readinessWeight: 5,
    maxLength: 100,
  },
  {
    key: "identity.display_name",
    label: "Agent name",
    type: "text",
    placeholder: "Ava",
    required: true,
    readinessWeight: 5,
    maxLength: 60,
  },
  {
    key: "identity.tone",
    label: "Voice & tone",
    type: "select",
    options: toneOptions,
    required: true,
    readinessWeight: 4,
  },
  {
    key: "identity.languages",
    label: "Languages",
    type: "multiselect",
    options: languageOptions,
    required: true,
    readinessWeight: 4,
  },
];

export const AGENT_TEMPLATES: Record<AiAgentSlug, AgentTemplate> = {
  "ai-appointment-setter-email": {
    slug: "ai-appointment-setter-email",
    vertical: "sales and appointment setting",
    defaultDisplayName: "Ava",
    sections: [
      {
        id: "identity",
        title: "Agent Identity",
        description: "Make the appointment setter sound and feel like your business.",
        fields: commonIdentity("sales and appointment setting"),
      },
      {
        id: "capabilities",
        title: "Capabilities",
        description: "Define who the agent should contact, qualify, and book.",
        fields: [
          { key: "capabilities.offer", label: "What are you selling?", type: "textarea", required: true, readinessWeight: 10, maxLength: 800 },
          { key: "capabilities.ideal_lead", label: "Ideal lead", type: "textarea", required: true, readinessWeight: 10, maxLength: 800 },
          { key: "capabilities.qualification_questions", label: "Qualification questions", type: "textarea", required: true, readinessWeight: 10, maxLength: 1200 },
          { key: "capabilities.meeting_length", label: "Meeting length (minutes)", type: "number", required: true, readinessWeight: 5 },
          { key: "capabilities.business_hours", label: "Business hours", type: "textarea", required: true, readinessWeight: 5, maxLength: 500 },
          { key: "capabilities.follow_up_cadence", label: "Follow-up cadence", type: "textarea", readinessWeight: 3, maxLength: 500 },
          { key: "capabilities.max_follow_ups", label: "Maximum follow-up attempts", type: "number", readinessWeight: 2 },
          { key: "capabilities.stop_conditions", label: "Stop conditions", type: "textarea", readinessWeight: 3, maxLength: 600 },
        ],
      },
    ],
    connections: [
      { key: "calendar", label: "Calendar", description: "Choose where qualified meetings should be booked.", blocking: true },
      { key: "email", label: "Email sending", description: "Connect an approved sender before outreach can go live.", blocking: true },
      { key: "crm", label: "CRM", description: "Optional activity-log destination for lead and meeting updates.", blocking: false },
    ],
    samplePrompts: [
      "I’m interested, but I only have 15 minutes next week.",
      "What would you need to know before booking me?",
      "Can you follow up with me Friday afternoon?",
    ],
  },

  "ai-phone-attendant": {
    slug: "ai-phone-attendant",
    vertical: "phone answering and call routing",
    defaultDisplayName: "Ava",
    sections: [
      {
        id: "identity",
        title: "Agent Identity",
        description: "Set the voice, greeting, and language for your 24/7 phone line.",
        fields: [
          ...commonIdentity("phone answering and call routing"),
          { key: "identity.greeting", label: "Opening greeting", type: "textarea", required: true, readinessWeight: 10, maxLength: 600 },
        ],
      },
      {
        id: "capabilities",
        title: "Capabilities",
        description: "Define routing, after-hours behavior, booking, and escalation rules.",
        fields: [
          { key: "capabilities.business_hours", label: "Business hours", type: "textarea", required: true, readinessWeight: 8, maxLength: 500 },
          { key: "capabilities.after_hours", label: "After-hours behavior", type: "textarea", required: true, readinessWeight: 8, maxLength: 800 },
          { key: "capabilities.departments", label: "Departments / routing labels", type: "textarea", required: true, readinessWeight: 8, maxLength: 800 },
          { key: "capabilities.appointment_behavior", label: "Appointment or order behavior", type: "textarea", readinessWeight: 5, maxLength: 800 },
          { key: "capabilities.escalation_contact", label: "Escalation contact", type: "text", required: true, readinessWeight: 10, maxLength: 200 },
          { key: "capabilities.faq", label: "Common questions & answers", type: "textarea", readinessWeight: 5, maxLength: 2000 },
        ],
      },
    ],
    connections: [
      { key: "phone", label: "AI phone number", description: "A real provisioned phone number is required before live calls can be answered.", blocking: true },
      { key: "calendar", label: "Calendar", description: "Needed if the agent will book appointments by phone.", blocking: false },
      { key: "sms", label: "SMS summaries", description: "Needed to text voicemail or call summaries to your team.", blocking: false },
    ],
    samplePrompts: [
      "I need to speak with sales about pricing.",
      "Are you open after 6 tonight?",
      "Can you book me for tomorrow morning?",
    ],
  },

  "ai-restaurant-host": {
    slug: "ai-restaurant-host",
    vertical: "restaurant reservations and to-go orders",
    defaultDisplayName: "Ava",
    sections: [
      {
        id: "identity",
        title: "Agent Identity",
        description: "Set the restaurant identity, voice, and customer-facing style.",
        fields: commonIdentity("restaurant"),
      },
      {
        id: "capabilities",
        title: "Capabilities",
        description: "Configure reservations, ordering, large parties, and catering.",
        fields: [
          { key: "capabilities.hours", label: "Hours", type: "textarea", required: true, readinessWeight: 10, maxLength: 600 },
          { key: "capabilities.location", label: "Location", type: "text", required: true, readinessWeight: 6, maxLength: 300 },
          { key: "capabilities.menu_url", label: "Menu / ordering URL", type: "url", required: true, readinessWeight: 10, maxLength: 300 },
          { key: "capabilities.reservation_url", label: "Reservation URL", type: "url", readinessWeight: 6, maxLength: 300 },
          { key: "capabilities.large_party_threshold", label: "Large-party threshold", type: "number", readinessWeight: 3 },
          { key: "capabilities.catering_contact", label: "Catering contact", type: "text", readinessWeight: 3, maxLength: 200 },
          { key: "capabilities.unavailable_item_policy", label: "Sold-out / unavailable item handling", type: "textarea", readinessWeight: 4, maxLength: 700 },
          { key: "capabilities.order_handoff", label: "Order handoff instructions", type: "textarea", required: true, readinessWeight: 8, maxLength: 1000 },
          { key: "capabilities.faq", label: "Restaurant FAQ", type: "textarea", readinessWeight: 5, maxLength: 2000 },
        ],
      },
    ],
    connections: [
      { key: "ordering", label: "Ordering platform", description: "Connect Toast or another ordering destination before claiming orders are transmitted automatically.", blocking: true },
      { key: "reservations", label: "Reservation platform", description: "Optional real-time reservation destination.", blocking: false },
      { key: "phone", label: "Phone line", description: "Required if the agent will answer restaurant calls.", blocking: false },
    ],
    samplePrompts: [
      "Can I order two burgers for pickup at 7?",
      "Do you have a table for eight Saturday night?",
      "What time does the kitchen close?",
    ],
  },

  "ai-tour-seller": {
    slug: "ai-tour-seller",
    vertical: "tours and excursions",
    defaultDisplayName: "Ava",
    sections: [
      { id: "identity", title: "Agent Identity", description: "Give your tour seller the right operator identity and voice.", fields: commonIdentity("tour operator") },
      {
        id: "capabilities",
        title: "Capabilities",
        description: "Define the tours, policies, meeting points, and upsells it can discuss.",
        fields: [
          { key: "capabilities.tours", label: "Tours / excursions", type: "textarea", required: true, readinessWeight: 12, maxLength: 1800 },
          { key: "capabilities.operating_hours", label: "Operating dates & hours", type: "textarea", required: true, readinessWeight: 8, maxLength: 800 },
          { key: "capabilities.booking_url", label: "Booking URL", type: "url", required: true, readinessWeight: 10, maxLength: 300 },
          { key: "capabilities.pickup_points", label: "Pickup / meeting points", type: "textarea", required: true, readinessWeight: 10, maxLength: 1200 },
          { key: "capabilities.age_policy", label: "Age / minor policies", type: "textarea", readinessWeight: 4, maxLength: 800 },
          { key: "capabilities.cancellation_policy", label: "Cancellation policy", type: "textarea", readinessWeight: 4, maxLength: 1000 },
          { key: "capabilities.group_rates", label: "Group-rate rules", type: "textarea", readinessWeight: 4, maxLength: 800 },
          { key: "capabilities.upsells", label: "Upsells & add-ons", type: "textarea", readinessWeight: 4, maxLength: 1000 },
          { key: "capabilities.faq", label: "Cruise guest / tourist FAQ", type: "textarea", readinessWeight: 5, maxLength: 2000 },
        ],
      },
    ],
    connections: [
      { key: "booking", label: "Booking platform", description: "FareHarbor, Viator, or another booking destination must be connected before real-time booking claims are shown.", blocking: true },
      { key: "inventory", label: "Availability feed", description: "Optional live availability and pricing source.", blocking: false },
    ],
    samplePrompts: [
      "We’re on a cruise and only have six hours in port. What do you recommend?",
      "Do you have space for 12 people tomorrow?",
      "Where exactly do we meet for the tour?",
    ],
  },

  "ai-airbnb-reservations": {
    slug: "ai-airbnb-reservations",
    vertical: "short-term rentals",
    defaultDisplayName: "Ava",
    sections: [
      { id: "identity", title: "Agent Identity", description: "Configure your host identity, voice, and guest experience.", fields: commonIdentity("short-term rentals") },
      {
        id: "capabilities",
        title: "Capabilities",
        description: "Teach the agent about properties, check-in, house rules, and guest upsells.",
        fields: [
          { key: "capabilities.properties", label: "Properties", type: "textarea", required: true, readinessWeight: 12, maxLength: 2000 },
          { key: "capabilities.booking_urls", label: "Listing / booking URLs", type: "textarea", required: true, readinessWeight: 8, maxLength: 1500 },
          { key: "capabilities.check_in", label: "Check-in time & instructions", type: "textarea", required: true, readinessWeight: 10, maxLength: 1200 },
          { key: "capabilities.check_out", label: "Check-out time & instructions", type: "textarea", required: true, readinessWeight: 7, maxLength: 1000 },
          { key: "capabilities.house_rules", label: "House rules", type: "textarea", required: true, readinessWeight: 8, maxLength: 1600 },
          { key: "capabilities.early_late_rules", label: "Early check-in / late checkout rules", type: "textarea", readinessWeight: 4, maxLength: 900 },
          { key: "capabilities.extra_night_upsell", label: "Extra-night upsell", type: "textarea", readinessWeight: 3, maxLength: 700 },
          { key: "capabilities.escalation_contact", label: "Emergency / escalation contact", type: "text", required: true, readinessWeight: 10, maxLength: 200 },
          { key: "capabilities.review_timing", label: "Review-request timing", type: "textarea", readinessWeight: 3, maxLength: 500 },
        ],
      },
    ],
    connections: [
      { key: "booking", label: "Booking channel", description: "A live Airbnb/PMS/booking integration is required before availability or reservations are represented as live.", blocking: true },
      { key: "messaging", label: "Guest messaging", description: "Required for automated guest messaging outside preview mode.", blocking: false },
    ],
    samplePrompts: [
      "Can I check in two hours early?",
      "Where do I park and how do I get inside?",
      "Is the property available for one more night?",
    ],
  },

  "ai-event-promoter": {
    slug: "ai-event-promoter",
    vertical: "events and promotions",
    defaultDisplayName: "Ava",
    sections: [
      { id: "identity", title: "Agent Identity", description: "Set the promoter voice, event brand, and audience tone.", fields: commonIdentity("events and promotions") },
      {
        id: "capabilities",
        title: "Capabilities",
        description: "Configure active events, ticketing, VIP options, reminders, and follow-up.",
        fields: [
          { key: "capabilities.events", label: "Active events", type: "textarea", required: true, readinessWeight: 12, maxLength: 1800 },
          { key: "capabilities.ticket_url", label: "Ticket URL", type: "url", required: true, readinessWeight: 10, maxLength: 300 },
          { key: "capabilities.location", label: "Venue / location", type: "text", required: true, readinessWeight: 8, maxLength: 300 },
          { key: "capabilities.event_faq", label: "Event FAQ", type: "textarea", required: true, readinessWeight: 7, maxLength: 1600 },
          { key: "capabilities.access_rules", label: "Age / access rules", type: "textarea", readinessWeight: 4, maxLength: 800 },
          { key: "capabilities.vip_offers", label: "VIP / table offerings", type: "textarea", readinessWeight: 5, maxLength: 900 },
          { key: "capabilities.campaign_channels", label: "Campaign channels", type: "multiselect", options: [{ label: "Email", value: "email" }, { label: "SMS", value: "sms" }, { label: "Social", value: "social" }], readinessWeight: 4 },
          { key: "capabilities.reminder_timing", label: "Reminder timing", type: "textarea", readinessWeight: 4, maxLength: 700 },
          { key: "capabilities.post_event_follow_up", label: "Post-event follow-up", type: "textarea", readinessWeight: 3, maxLength: 700 },
        ],
      },
    ],
    connections: [
      { key: "ticketing", label: "Ticketing platform", description: "Eventbrite, DICE, or another ticket destination must be connected before purchases are represented as live.", blocking: true },
      { key: "email", label: "Email campaigns", description: "Needed for outbound event email campaigns.", blocking: false },
      { key: "sms", label: "SMS campaigns", description: "Needed for reminder blasts by text.", blocking: false },
      { key: "social", label: "Social publishing", description: "Needed before scheduled posts can publish automatically.", blocking: false },
    ],
    samplePrompts: [
      "Is this event 21+?",
      "What do VIP tickets include?",
      "Where do I buy tickets for Saturday?",
    ],
  },

  "ai-schedule-filler": {
    slug: "ai-schedule-filler",
    vertical: "appointment reactivation and schedule filling",
    defaultDisplayName: "Ava",
    sections: [
      { id: "identity", title: "Agent Identity", description: "Set the business identity and outreach tone.", fields: commonIdentity("appointment-based business") },
      {
        id: "capabilities",
        title: "Capabilities",
        description: "Define who can be contacted, when, and what open slots should be filled.",
        fields: [
          { key: "capabilities.appointment_types", label: "Appointment types", type: "textarea", required: true, readinessWeight: 10, maxLength: 1000 },
          { key: "capabilities.source_list", label: "Eligible audience / source list", type: "textarea", required: true, readinessWeight: 12, maxLength: 1400 },
          { key: "capabilities.open_slot_rules", label: "Cancellation / open-slot rules", type: "textarea", required: true, readinessWeight: 10, maxLength: 1200 },
          { key: "capabilities.outreach_channels", label: "Outreach channels", type: "multiselect", options: [{ label: "Email", value: "email" }, { label: "SMS", value: "sms" }], required: true, readinessWeight: 6 },
          { key: "capabilities.allowed_hours", label: "Allowed outreach hours", type: "textarea", required: true, readinessWeight: 6, maxLength: 600 },
          { key: "capabilities.recall_cadence", label: "Recall cadence", type: "textarea", readinessWeight: 5, maxLength: 800 },
          { key: "capabilities.unsubscribe_handling", label: "Stop / unsubscribe handling", type: "textarea", required: true, readinessWeight: 8, maxLength: 800 },
          { key: "capabilities.report_recipient", label: "Monthly report recipient", type: "text", readinessWeight: 3, maxLength: 200 },
        ],
      },
    ],
    connections: [
      { key: "calendar", label: "Calendar", description: "A real calendar destination is required before bookings can be placed automatically.", blocking: true },
      { key: "contacts", label: "Customer list", description: "A permitted customer/lead source is required before outreach can run.", blocking: true },
      { key: "email", label: "Email sending", description: "Needed for email reactivation campaigns.", blocking: false },
      { key: "sms", label: "SMS sending", description: "Needed for text reactivation campaigns.", blocking: false },
    ],
    samplePrompts: [
      "I missed my last appointment. Do you have anything this week?",
      "Can you remind me if a Friday slot opens up?",
      "Please stop texting me about openings.",
    ],
  },

  "ai-marketing-manager": {
    slug: "ai-marketing-manager",
    vertical: "marketing management",
    defaultDisplayName: "Ava",
    sections: [
      { id: "identity", title: "Agent Identity", description: "Define the brand, voice, and service area the marketing manager represents.", fields: commonIdentity("marketing") },
      {
        id: "capabilities",
        title: "Capabilities",
        description: "Configure audiences, offers, content priorities, and campaign cadence.",
        fields: [
          { key: "capabilities.service_area", label: "Service area", type: "textarea", required: true, readinessWeight: 8, maxLength: 800 },
          { key: "capabilities.target_customers", label: "Target customers", type: "textarea", required: true, readinessWeight: 12, maxLength: 1200 },
          { key: "capabilities.products_services", label: "Products / services", type: "textarea", required: true, readinessWeight: 10, maxLength: 1500 },
          { key: "capabilities.brand_voice", label: "Brand voice", type: "textarea", required: true, readinessWeight: 10, maxLength: 1000 },
          { key: "capabilities.offer_rules", label: "Offers & promotion rules", type: "textarea", readinessWeight: 5, maxLength: 1000 },
          { key: "capabilities.content_categories", label: "Content categories", type: "textarea", required: true, readinessWeight: 8, maxLength: 1000 },
          { key: "capabilities.posting_frequency", label: "Posting frequency", type: "textarea", readinessWeight: 4, maxLength: 500 },
        ],
      },
    ],
    connections: [
      { key: "social", label: "Social accounts", description: "Publishing remains in setup until real social accounts are connected.", blocking: false },
      { key: "email", label: "Email campaigns", description: "Needed before campaign emails can be sent.", blocking: false },
      { key: "reviews", label: "Review workflow", description: "Needed before automated review requests can run.", blocking: false },
      { key: "website", label: "Website / CMS", description: "Needed before SEO pages or blog content can publish automatically.", blocking: false },
    ],
    samplePrompts: [
      "Write a promotion for our slowest weekday.",
      "What should we post this week to attract local customers?",
      "How would you ask a happy customer for a review?",
    ],
  },

  "ai-legal-intake": {
    slug: "ai-legal-intake",
    vertical: "law firm intake and reception",
    defaultDisplayName: "Ava",
    sections: [
      { id: "identity", title: "Agent Identity", description: "Set the law-firm identity and professional intake tone.", fields: commonIdentity("law firm") },
      {
        id: "capabilities",
        title: "Capabilities",
        description: "Configure intake, consultation, urgency, conflict pre-check, and routing rules.",
        fields: [
          { key: "capabilities.practice_areas", label: "Practice areas", type: "textarea", required: true, readinessWeight: 12, maxLength: 1400 },
          { key: "capabilities.office_hours", label: "Office hours", type: "textarea", required: true, readinessWeight: 6, maxLength: 500 },
          { key: "capabilities.consultation_rules", label: "Consultation rules", type: "textarea", required: true, readinessWeight: 10, maxLength: 1200 },
          { key: "capabilities.intake_questions", label: "New-client intake questions", type: "textarea", required: true, readinessWeight: 10, maxLength: 1800 },
          { key: "capabilities.disqualification_rules", label: "Disqualification rules", type: "textarea", readinessWeight: 5, maxLength: 1200 },
          { key: "capabilities.conflict_questions", label: "Conflict pre-check questions", type: "textarea", readinessWeight: 6, maxLength: 1200 },
          { key: "capabilities.urgent_triggers", label: "Urgent-matter triggers", type: "textarea", required: true, readinessWeight: 8, maxLength: 1000 },
          { key: "capabilities.routing", label: "Attorney / team routing", type: "textarea", required: true, readinessWeight: 10, maxLength: 1200 },
        ],
      },
    ],
    connections: [
      { key: "calendar", label: "Consultation calendar", description: "Needed before consultations can be booked automatically.", blocking: false },
      { key: "phone", label: "Phone line", description: "Needed before live phone answering can be activated.", blocking: false },
      { key: "crm", label: "Case / intake system", description: "Optional destination for intake records after a real integration is connected.", blocking: false },
    ],
    samplePrompts: [
      "I was served papers today. Can someone speak with me?",
      "Do you handle business contract disputes?",
      "What information do you need before I schedule a consultation?",
    ],
    complianceNote: "This agent supports intake and reception workflows only. It does not provide legal advice.",
  },

  "ai-dental-front-desk": {
    slug: "ai-dental-front-desk",
    vertical: "dental front desk",
    defaultDisplayName: "Ava",
    sections: [
      { id: "identity", title: "Agent Identity", description: "Set the practice identity and patient-facing tone.", fields: commonIdentity("dental practice") },
      {
        id: "capabilities",
        title: "Capabilities",
        description: "Configure scheduling, new-patient intake, recalls, reminders, and front-desk rules.",
        fields: [
          { key: "capabilities.locations", label: "Practice locations", type: "textarea", required: true, readinessWeight: 10, maxLength: 1200 },
          { key: "capabilities.office_hours", label: "Office hours", type: "textarea", required: true, readinessWeight: 8, maxLength: 600 },
          { key: "capabilities.services", label: "Services", type: "textarea", required: true, readinessWeight: 8, maxLength: 1500 },
          { key: "capabilities.new_patient_rules", label: "New-patient rules", type: "textarea", required: true, readinessWeight: 8, maxLength: 1200 },
          { key: "capabilities.insurance_workflow", label: "Insurance / eligibility workflow", type: "textarea", readinessWeight: 5, maxLength: 1200 },
          { key: "capabilities.recall_cadence", label: "Recall cadence", type: "textarea", readinessWeight: 4, maxLength: 800 },
          { key: "capabilities.reminder_cadence", label: "Reminder cadence", type: "textarea", readinessWeight: 4, maxLength: 800 },
          { key: "capabilities.no_show_handling", label: "No-show handling", type: "textarea", readinessWeight: 4, maxLength: 900 },
          { key: "capabilities.faq", label: "Patient FAQ", type: "textarea", readinessWeight: 5, maxLength: 2000 },
          { key: "capabilities.escalation_contact", label: "Escalation contact", type: "text", required: true, readinessWeight: 10, maxLength: 200 },
        ],
      },
    ],
    connections: [
      { key: "calendar", label: "Scheduling system", description: "Required before appointments can be scheduled automatically.", blocking: true },
      { key: "insurance", label: "Insurance eligibility", description: "Remains setup-only until a real eligibility workflow/integration is connected.", blocking: false },
      { key: "forms", label: "New-patient forms", description: "Optional forms destination for real patient intake.", blocking: false },
      { key: "phone", label: "Phone line", description: "Needed before 24/7 call answering can be activated.", blocking: false },
    ],
    samplePrompts: [
      "Do you take new patients this week?",
      "Can you tell me if my insurance is accepted?",
      "I need to move my cleaning appointment.",
    ],
    complianceNote: "Insurance verification is shown as setup-only until a real eligibility integration is connected.",
  },
};

export function getAgentTemplate(slug: string): AgentTemplate | null {
  return (AGENT_TEMPLATES as Record<string, AgentTemplate>)[slug] ?? null;
}
