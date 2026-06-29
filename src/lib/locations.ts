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
  {
    slug: "sugar-land",
    city: "Sugar Land",
    headline: "Virtual office & business support in Sugar Land, TX",
    intro:
      "Sugar Land businesses get a credible address, virtual mailbox, AI agents, and managed virtual assistants — a polished presence without Fort Bend office rent.",
    nearby: "Missouri City, Stafford, Richmond, and southwest Houston",
    metaDescription:
      "Virtual office, mailbox, AI receptionist, and virtual assistants for Sugar Land, TX. Online signup.",
  },
  {
    slug: "katy",
    city: "Katy",
    headline: "Virtual office & business support in Katy, TX",
    intro:
      "Katy entrepreneurs get a professional business address, virtual mailbox, 24/7 AI receptionist, and virtual assistants — run your business from home with a front office that never sleeps.",
    nearby: "Cinco Ranch, Fulshear, Cypress, and west Houston",
    metaDescription:
      "Virtual office, mailbox, AI receptionist, and virtual assistants for Katy, TX. Sign up online.",
  },
  {
    slug: "the-woodlands",
    city: "The Woodlands",
    headline: "Virtual office & business support in The Woodlands, TX",
    intro:
      "The Woodlands businesses get a professional address, virtual mailbox, AI agents, and managed virtual assistants — premium presence, fully online, no long-term lease.",
    nearby: "Spring, Conroe, Shenandoah, and north Houston",
    metaDescription:
      "Virtual office, mailbox, AI receptionist, and virtual assistants for The Woodlands, TX. Online signup.",
  },
  {
    slug: "webster",
    city: "Webster",
    headline: "Virtual office & business support in Webster, TX",
    intro:
      "Webster and Clear Lake businesses get a real address, virtual mailbox, AI receptionist, and virtual assistants — perfect for the NASA/Bay Area corridor.",
    nearby: "Clear Lake, Nassau Bay, El Lago, and Seabrook",
    metaDescription:
      "Virtual office, mailbox, AI receptionist, and virtual assistants for Webster & Clear Lake, TX.",
  },
  {
    slug: "kemah",
    city: "Kemah",
    headline: "Virtual office & business support in Kemah, TX",
    intro:
      "Kemah business owners get a professional address, virtual mailbox, AI agents, and virtual assistants — keep your waterfront business lean and covered year-round.",
    nearby: "Seabrook, League City, Clear Lake Shores, and the Bay Area",
    metaDescription:
      "Virtual office, mailbox, AI receptionist, and virtual assistants for Kemah, TX. Online signup.",
  },
  {
    slug: "dickinson",
    city: "Dickinson",
    headline: "Virtual office & business support in Dickinson, TX",
    intro:
      "Dickinson businesses get a credible address, virtual mailbox, 24/7 AI receptionist, and virtual assistants — mainland Gulf Coast support, all online.",
    nearby: "League City, Santa Fe, Bacliff, and Texas City",
    metaDescription:
      "Virtual office, mailbox, AI receptionist, and virtual assistants for Dickinson, TX. Sign up online.",
  },
  {
    slug: "alvin",
    city: "Alvin",
    headline: "Virtual office & business support in Alvin, TX",
    intro:
      "Alvin entrepreneurs get a professional business address, virtual mailbox, AI agents, and managed virtual assistants — everything to look bigger and run leaner.",
    nearby: "Pearland, Manvel, Santa Fe, and Brazoria County",
    metaDescription:
      "Virtual office, mailbox, AI receptionist, and virtual assistants for Alvin, TX. Online signup.",
  },
];

export function getLocation(slug: string): Location | undefined {
  return LOCATIONS.find((l) => l.slug === slug);
}
