// Vertical landing pages. Add a new object here to launch a new industry page
// at /industries/<slug> — no new code required.

export type Industry = {
  slug: string;
  name: string;        // plural, e.g. "Dental Practices"
  eyebrow: string;     // small label, e.g. "AI for Dental Practices"
  headline: string;
  subhead: string;
  pains: string[];     // "sound familiar?" problems
  outcomes: string[];  // what the AI delivers
  agentSlugs: string[]; // service slugs to feature (from the catalog)
  metaDescription: string;
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "dental",
    name: "Dental Practices",
    eyebrow: "AI for Dental Practices",
    headline: "Stop losing patients to voicemail, no-shows, and missed recalls",
    subhead:
      "An AI front desk built for dental practices — it answers every call, books and confirms appointments, verifies insurance, and fills your schedule from recalls. Your team focuses on patients; the AI handles the phones and forms.",
    pains: [
      "Calls go to voicemail during procedures — and every missed call is a lost patient.",
      "No-shows and last-minute cancellations leave costly gaps in the schedule.",
      "Insurance verification eats hours of front-desk time every week.",
      "Overdue recalls pile up while the phone keeps ringing.",
    ],
    outcomes: [
      "Never miss a new-patient call — answered 24/7",
      "Fill cancellations automatically from your recall list",
      "Insurance verified before the visit",
      "Fewer no-shows with smart reminders",
      "More 5-star reviews from happy patients",
    ],
    agentSlugs: ["ai-dental-front-desk", "ai-receptionist", "ai-speed-to-lead", "ai-review-manager"],
    metaDescription:
      "AI front desk for dental practices: 24/7 call answering, appointment booking, insurance verification, recalls, and fewer no-shows.",
  },
  {
    slug: "hair-salons",
    name: "Hair Salons & Spas",
    eyebrow: "AI for Hair Salons",
    headline: "Keep every chair full — without the front desk chaos",
    subhead:
      "An AI receptionist for your salon that books appointments 24/7, fills last-minute openings, sends reminders to cut no-shows, and asks happy clients for reviews — so your stylists can focus on clients, not the phone.",
    pains: [
      "Stylists can't answer the phone mid-cut, so bookings slip away.",
      "Last-minute cancellations leave empty chairs and lost revenue.",
      "No-shows add up when reminders fall through the cracks.",
      "Rebooking and review requests never happen when it's busy.",
    ],
    outcomes: [
      "Book appointments 24/7, even after hours",
      "Fill last-minute openings from your waitlist",
      "Cut no-shows with automatic reminders",
      "Automatic rebooking prompts after each visit",
      "More 5-star reviews on Google & Yelp",
    ],
    agentSlugs: ["ai-receptionist", "ai-speed-to-lead", "ai-review-manager", "ai-social-manager"],
    metaDescription:
      "AI receptionist for hair salons: 24/7 booking, fill last-minute openings, reduce no-shows, automatic rebooking and reviews.",
  },
  {
    slug: "home-services",
    name: "Home Services",
    eyebrow: "AI for Home Services",
    headline: "Win the job by answering first — every time",
    subhead:
      "For HVAC, plumbing, electrical, and contractors: an AI that answers every call, books the job, and instantly follows up with every online lead — so you stop losing work to the competitor who picked up first.",
    pains: [
      "You miss calls on the job site — and 60–80% of missed calls never call back.",
      "Online leads sit for hours; the fastest responder wins the job.",
      "After-hours emergencies go to voicemail and to your competitors.",
      "No time to chase reviews that win the next customer.",
    ],
    outcomes: [
      "Answer and book jobs 24/7, even on the job site",
      "Text every new lead in seconds",
      "Capture after-hours emergency calls",
      "More 5-star reviews to win local search",
    ],
    agentSlugs: ["ai-receptionist", "ai-speed-to-lead", "ai-review-manager", "ai-full-employee"],
    metaDescription:
      "AI receptionist & speed-to-lead for home services (HVAC, plumbing, electrical): answer every call, book jobs 24/7, follow up instantly.",
  },
  {
    slug: "law-firms",
    name: "Law Firms",
    eyebrow: "AI for Law Firms",
    headline: "Turn every call into a booked consultation",
    subhead:
      "An AI intake assistant for law firms — it answers 24/7, screens and qualifies callers, books consultations, and follows up with every lead so you never lose a case to a missed call.",
    pains: [
      "Potential clients call after hours and reach voicemail.",
      "Intake and screening pull attorneys and staff away from billable work.",
      "Leads go cold before anyone follows up.",
      "Missed calls mean cases that walk to another firm.",
    ],
    outcomes: [
      "Answer and screen callers 24/7",
      "Book qualified consultations automatically",
      "Instant follow-up on every web lead",
      "A private AI trained on your practice areas",
    ],
    agentSlugs: ["ai-receptionist", "ai-speed-to-lead", "ai-knowledge", "ai-review-manager"],
    metaDescription:
      "AI intake assistant for law firms: 24/7 answering, caller screening, consultation booking, and instant lead follow-up.",
  },
  {
    slug: "med-spas",
    name: "Med Spas & Aesthetics",
    eyebrow: "AI for Med Spas",
    headline: "Book more treatments while you focus on clients",
    subhead:
      "An AI front desk for med spas and aesthetic clinics — books and confirms appointments, follows up with leads instantly, grows your reviews, and keeps your social feed full of on-brand content.",
    pains: [
      "Inquiries come in after hours and on social — and go unanswered.",
      "High-value consults are lost to slow follow-up.",
      "No-shows hurt when treatments are booked back-to-back.",
      "Keeping social and reviews active is a constant grind.",
    ],
    outcomes: [
      "Book and confirm treatments 24/7",
      "Instant follow-up on every inquiry & DM",
      "Fewer no-shows with reminders",
      "On-brand social content, posted for you",
      "More 5-star reviews",
    ],
    agentSlugs: ["ai-receptionist", "ai-speed-to-lead", "ai-social-manager", "ai-review-manager"],
    metaDescription:
      "AI front desk for med spas: 24/7 booking, instant lead follow-up, social content, and review growth.",
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}
