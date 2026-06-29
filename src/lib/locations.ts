// City landing pages for local SEO. Add a city here to launch /locations/<slug>.
export type Location = {
  slug: string;
  city: string;            // "Houston"
  headline: string;
  intro: string;
  nearby: string;          // surrounding areas to mention
  metaDescription: string;
};

export const LOCATIONS: Location[] = [
  {
    slug: "galveston",
    city: "Galveston",
    headline: "Virtual office & business support in Galveston, TX",
    intro:
      "A real Galveston street address, virtual mailbox, managed virtual assistants, and AI agents — run your Galveston business from anywhere, with a local team on the island.",
    nearby: "Galveston Island, the Strand, Seawall, and the Port of Galveston",
    metaDescription:
      "Virtual office, business address, virtual mailbox, and AI business support in Galveston, TX. Real local team on the island. Sign up online.",
  },
  {
    slug: "houston",
    city: "Houston",
    headline: "Virtual office & business support for Houston businesses",
    intro:
      "Give your Houston business a professional address, a 24/7 AI receptionist, managed virtual assistants, and a virtual mailbox — all without the cost of downtown office space.",
    nearby: "Downtown Houston, the Galleria, the Heights, Sugar Land, and Katy",
    metaDescription:
      "Virtual office, virtual mailbox, AI receptionist, and virtual assistants for Houston, TX businesses. Affordable, professional, and online.",
  },
  {
    slug: "league-city",
    city: "League City",
    headline: "Virtual office & business support in League City, TX",
    intro:
      "Serving League City entrepreneurs with a real business address, virtual mailbox, AI agents, and managed virtual assistants — minutes from home, all online.",
    nearby: "Clear Lake, Kemah, Webster, and the Bay Area",
    metaDescription:
      "Virtual office, mailbox, and AI business support for League City, TX. Local Gulf Coast team. Sign up online.",
  },
  {
    slug: "texas-city",
    city: "Texas City",
    headline: "Virtual office & business support in Texas City, TX",
    intro:
      "Texas City businesses get a professional address, virtual mailbox, AI receptionist, and virtual assistants — keep your operation lean and your front office covered.",
    nearby: "La Marque, Hitchcock, Bacliff, and the mainland Gulf Coast",
    metaDescription:
      "Virtual office, mailbox, AI receptionist, and virtual assistants for Texas City, TX. Affordable and online.",
  },
  {
    slug: "friendswood",
    city: "Friendswood",
    headline: "Virtual office & business support in Friendswood, TX",
    intro:
      "Friendswood business owners get a credible business address, virtual mailbox, AI agents, and managed virtual assistants — professional presence without the overhead.",
    nearby: "Pearland, League City, Clear Lake, and the Bay Area",
    metaDescription:
      "Virtual office, mailbox, and AI business support for Friendswood, TX. Local team, online signup.",
  },
  {
    slug: "pearland",
    city: "Pearland",
    headline: "Virtual office & business support in Pearland, TX",
    intro:
      "Pearland entrepreneurs get a professional address, virtual mailbox, 24/7 AI receptionist, and virtual assistants — everything to run and grow, fully online.",
    nearby: "Friendswood, Manvel, Alvin, and south Houston",
    metaDescription:
      "Virtual office, mailbox, AI receptionist, and virtual assistants for Pearland, TX. Sign up online.",
  },
];

export function getLocation(slug: string): Location | undefined {
  return LOCATIONS.find((l) => l.slug === slug);
}
