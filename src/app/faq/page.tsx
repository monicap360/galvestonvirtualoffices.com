import Link from "next/link";
import { getTenant } from "@/lib/tenant";

export const metadata = {
  title: "How It Works & FAQ",
  description:
    "How Galveston Virtual Offices works — getting started, paying by business check, your real Galveston mailing address, USPS Form 1583, AI agents, offices, and cancellation. Common questions answered.",
};

const steps = [
  { n: 1, t: "Sign up online", d: "Create your account in a few minutes and pick the plan or service you need — mailbox, AI agent, office, or a bundle." },
  { n: 2, t: "Complete quick onboarding", d: "For a mailbox, finish a short setup packet — including USPS Form 1583 — so we can legally receive mail for you. We walk you through every step." },
  { n: 3, t: "Mail a business check", d: "Pay by business check with your reference code in the memo line. It keeps every account verified and legitimate. Your code and mailing address are in your dashboard." },
  { n: 4, t: "We handle the rest", d: "The moment we verify your check, your service goes live. We notify you when mail arrives, and you manage everything from your dashboard." },
];

type QA = { q: string; a: string };
type Group = { title: string; items: QA[] };

const FAQ: Group[] = [
  {
    title: "Getting started & billing",
    items: [
      { q: "How do I get started?", a: "Create your account online in a few minutes, choose the plan or service you need, and you'll get a reference code with simple next steps. For a mailbox you'll also complete a short onboarding packet (including USPS Form 1583). Then mail your business check to activate." },
      { q: "How do I pay?", a: "By business check, mailed to us with your reference code written in the memo line. That code ties the payment to your account. You'll find your reference code and our mailing address in your dashboard right after you sign up." },
      { q: "Why pay by check instead of a card?", a: "Paying by business check keeps every account tied to a real, verified business — it reduces fraud and keeps your mailbox and business address compliant and legitimate. There are no setup fees." },
      { q: "Is there a contract?", a: "No long-term contracts. Everything is month-to-month and you can cancel anytime." },
      { q: "When does my service start?", a: "As soon as we receive and verify your check. We'll notify you the moment it's processed and your account goes live." },
      { q: "How do I cancel?", a: "Just let us know from your dashboard or by phone or email. It's month-to-month — cancel anytime, no penalties." },
    ],
  },
  {
    title: "Your Galveston address, mail & packages",
    items: [
      { q: "Is this a real street address?", a: "Yes — a real Galveston street address (not a PO box) you can use for your business, website, Google listing, and mail." },
      { q: "What is USPS Form 1583 and do I need it?", a: "To legally receive mail on your behalf, USPS requires a completed Form 1583 along with two forms of ID, notarized. It's included in our onboarding packet and we guide you through completing it." },
      { q: "What happens when mail arrives?", a: "We accept it, photograph it, and it appears in your dashboard the same day. You can pick it up during business hours or ask us to forward it." },
      { q: "Do you accept packages?", a: "Yes — Amazon, UPS, FedEx, and other carriers. We photograph and hold your packages for pickup." },
      { q: "Can you forward my mail and packages?", a: "Yes. We can forward mail and packages to you on request." },
      { q: "I'm cruising out of Galveston — can I drop off or pick up?", a: "Absolutely. Our location is about two blocks from where the Carnival Breeze docks. Drop off or pick up on your way to the ship while we receive, photograph, and hold your mail and packages." },
    ],
  },
  {
    title: "AI agents & AI assistant",
    items: [
      { q: "What's the difference between the AI Assistant and AI Studio?", a: "The AI Assistant is a 24/7 chat assistant for your website. AI Studio is a menu of specialized AI agents — phone answering and auto-attendant, client intake, reservations, order-taking, scheduling, marketing, and more — that you subscribe to à la carte." },
      { q: "Can I try an agent before I buy?", a: "Yes. Every agent in AI Studio has a 'Try a demo' button so you can chat with it live and see exactly how it would work for your business before subscribing." },
      { q: "Are the agents trained on my business?", a: "Yes. We set each agent up trained on your business — your services, hours, and voice — so it answers like a member of your team." },
      { q: "How fast can an agent go live?", a: "Most agents are set up quickly after you subscribe. We tune them to your business before they start handling real customers." },
      { q: "Can I add or cancel agents anytime?", a: "Yes — every agent is month-to-month. Add or cancel any time as your needs change." },
    ],
  },
  {
    title: "Offices & general",
    items: [
      { q: "Do you have office space?", a: "Yes — a private office and coworking desks in Galveston. Day offices start at $45/day and desks at $25/day; book by the day or month." },
      { q: "Where are you located?", a: "Galveston, TX — right by the port, about two blocks from the Carnival Breeze cruise terminal." },
      { q: "How do I reach a real person?", a: "Call (409) 402-7908 or use our contact page. You'll get a real local team, not a call center." },
    ],
  },
];

export default async function FaqPage() {
  const tenant = await getTenant();

  // FAQ structured data for search engines.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.flatMap((g) =>
      g.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      }))
    ),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300/80">How it works</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white">Simple to start. Easy to run.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
          {tenant?.name ?? "Galveston Virtual Offices"} gives you a real Galveston presence and 24/7 AI support — set up
          online in minutes. Here&apos;s exactly how it works, and answers to the questions we hear most.
        </p>
      </header>

      {/* How it works */}
      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        {steps.map((s) => (
          <div key={s.n} className="card p-6">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-base font-bold text-slate-950 shadow-[0_0_20px_-6px_rgba(167,139,250,0.7)]">
              {s.n}
            </div>
            <h3 className="mt-3 font-semibold text-white">{s.t}</h3>
            <p className="mt-1 text-sm text-slate-400">{s.d}</p>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-center text-2xl font-bold text-white">Frequently asked questions</h2>
        <div className="mt-8 space-y-10">
          {FAQ.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-violet-300/80">{group.title}</h3>
              <div className="mt-3 space-y-2">
                {group.items.map((i) => (
                  <details key={i.q} className="card group p-0 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-white">
                      {i.q}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0 text-violet-300 transition-transform group-open:rotate-180">
                        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </summary>
                    <p className="px-5 pb-4 text-sm text-slate-400">{i.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16">
        <div className="card flex flex-col items-center gap-4 border-violet-400/20 p-10 text-center">
          <h2 className="text-2xl font-bold text-white">Still have a question?</h2>
          <p className="max-w-xl text-slate-300">Our local Galveston team is happy to help — or create your account and get started today.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn-primary px-6 py-3 text-base">Create your account</Link>
            <Link href="/contact" className="btn-outline px-6 py-3 text-base">Contact us</Link>
          </div>
          <a href="tel:+14094027908" className="text-sm text-slate-300 hover:text-violet-300">
            Or call <span className="font-semibold text-white">(409) 402-7908</span>
          </a>
        </div>
      </section>
    </div>
  );
}
