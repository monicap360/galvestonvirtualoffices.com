import Link from "next/link";
import { getTenant } from "@/lib/tenant";

// Minimalist line icons (Heroicons outline) — no clip art.
const ICONS: Record<string, string> = {
  assistant: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  mail: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
  office: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
  marketing: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z",
  platform: "m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9.75 6h13.5A2.25 2.25 0 0 0 21 18.75V6A2.25 2.25 0 0 0 18.75 3.75H5.25A2.25 2.25 0 0 0 3 6v12.75c0 .621.504 1.125 1.125 1.125Z",
  ai: "M8.25 12h.008v.008H8.25V12Zm3.75 0h.008v.008H12V12Zm3.75 0h.008v.008h-.008V12ZM21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.555-.337A5.97 5.97 0 0 1 5.41 20.97a5.97 5.97 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z",
  phone: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z",
};

function Icon({ name }: { name: string }) {
  return (
    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300 shadow-[0_0_24px_-8px_rgba(167,139,250,0.5)]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d={ICONS[name]} />
      </svg>
    </span>
  );
}

const offerings = [
  {
    href: "/ai-studio",
    title: "AI Phone Line & Auto-Attendant",
    blurb:
      "Your own 24/7 AI phone line — it answers every call in your business's voice, routes callers, books appointments, takes orders and messages, and texts you summaries. Never miss a call again.",
    icon: "phone",
  },
  {
    href: "/ai-assistant",
    title: "AI Assistant",
    blurb:
      "A 24/7 AI assistant trained on your business — answers customer questions, captures and qualifies leads, books appointments, and hands off to your team.",
    icon: "ai",
  },
  {
    href: "/mailboxes",
    title: "AI Virtual Mailbox & Packages",
    blurb:
      "A real Galveston street address for mail and packages. We accept and photograph everything — Amazon, UPS, FedEx, checks, legal — hold it for pickup, and you manage it all from your dashboard.",
    icon: "mail",
  },
  {
    href: "/offices",
    title: "Private Office & Desks",
    blurb:
      "A private office and coworking desks in Galveston — book by the day or month. Perfect for focused work, client visits, and growing businesses.",
    icon: "office",
  },
  {
    href: "/services/marketing",
    title: "AI Marketing Assistants",
    blurb:
      "A customized, always-on assistant that manages your Google profile, reviews, social posts, local SEO, and an AI website chatbot.",
    icon: "marketing",
  },
  {
    href: "/services/platforms",
    title: "Websites & Business Platforms",
    blurb:
      "We build your customer-facing website plus an admin back office — accounts, bookings, payments, and invoicing — like this very platform.",
    icon: "platform",
  },
];

const steps = [
  { n: 1, t: "Sign up online", d: "Create your account in minutes and pick the plan or service you need." },
  { n: 2, t: "Mail a business check", d: "Pay by business check with your reference code in the memo — it keeps every account verified and legitimate." },
  { n: 3, t: "We handle the rest", d: "Get notified the moment mail arrives, manage bookings, and track every order." },
];

// Honest, factual reasons to choose us — no fabricated testimonials.
const reasons = [
  { t: "A real Galveston street address", d: "Not a PO box — use it on your website, Google listing, LLC filings, and mail." },
  { t: "Two blocks from the cruise terminal", d: "Drop off or grab your mail and packages on your way to the Carnival Breeze." },
  { t: "No long-term contracts", d: "Everything is month-to-month. Cancel anytime, no penalties." },
  { t: "A real local team", d: "Talk to actual people in Galveston — never an overseas call center." },
  { t: "Packages received & photographed", d: "Amazon, UPS, FedEx — accepted, photographed to your dashboard the same day, held for pickup." },
  { t: "Try any AI agent free", d: "Test-drive your AI receptionist or assistant live before you pay a cent." },
];

const PHONE_DISPLAY = "(409) 402-7908";
const PHONE_HREF = "tel:+14094027908";

// Honest, factual trust signals (true for a new business — no fabricated social proof).
const trustSignals = [
  "6+ years on the Gulf Coast",
  "Real Galveston street address",
  "Packages accepted (Amazon, UPS, FedEx)",
  "Steps from the cruise terminal",
  "No long-term contracts",
];

export default async function HomePage() {
  const tenant = await getTenant();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/galveston-hero.jpg"
            alt="Galveston Pleasure Pier at sunset over the Gulf of Mexico"
            className="h-full w-full object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/85 to-slate-950" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-28 text-center">
          <span className="badge border border-violet-400/30 bg-violet-400/10 text-violet-200">
            ◇ Galveston · Texas Gulf Coast
          </span>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-violet-300/80">
            AI-Powered Business Support · Galveston &amp; Houston, TX
          </p>
          <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Everything to run your business —{" "}
            <span className="text-gradient">powered by AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            {tenant?.name ?? "Galveston Virtual Offices"}{" "}gives Gulf Coast businesses everything to launch, run, and
            grow — a 24/7 AI phone line &amp; assistants, a real Texas address, AI-powered mailbox &amp; package handling,
            offices, AI agents, and marketing. Sign up online; pay by business check so every account is verified.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/ai-studio" className="btn-primary px-6 py-3 text-base">Explore AI agents</Link>
            <Link href="/pricing" className="btn-outline px-6 py-3 text-base">See pricing</Link>
          </div>
          <p className="mt-5 text-sm text-slate-400">No long-term contracts · Cancel anytime · Real local team</p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="card flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-4 text-sm text-slate-300">
          {trustSignals.map((t) => (
            <span key={t} className="inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-violet-400">
                <path d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Offerings */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-white">Everything to run your business remotely</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
          Pick one service or bundle them all. Built for entrepreneurs, travelers, cruisers, and Gulf Coast businesses.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {offerings.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              className="card group p-6 transition-all hover:-translate-y-0.5 hover:border-violet-400/30 hover:shadow-[0_0_40px_-10px_rgba(167,139,250,0.35)]"
            >
              <Icon name={o.icon} />
              <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-violet-300">{o.title}</h3>
              <p className="mt-2 text-slate-400">{o.blurb}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-violet-300">Learn more →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cruise / traveler niche */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="card relative overflow-hidden bg-gradient-to-br from-violet-500/15 to-violet-500/15 p-12 text-center">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-violet-400/20 blur-3xl" />
          <h2 className="relative text-3xl font-bold text-white">Cruising or traveling out of Galveston?</h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-slate-300">
            Our commercial location is right portside — about <strong className="text-white">two blocks from where the
            Carnival Breeze docks</strong>. Drop off or pick up on your way to the ship while we receive, photograph,
            and hold your mail and packages — so you can sail with peace of mind.
          </p>
          <Link href="/mailboxes" className="btn-primary relative mt-7 px-6 py-3 text-base">
            Set up your travel mailbox
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-white">How it works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card p-6 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-lg font-bold text-slate-950 shadow-[0_0_24px_-6px_rgba(167,139,250,0.7)]">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-slate-400">
          Questions about the address, mail, or Form 1583?{" "}
          <Link href="/faq" className="font-semibold text-violet-300 hover:underline">See how it works &amp; FAQ →</Link>
        </p>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-white">Why businesses choose us</h2>
        <p className="mt-2 text-center text-sm text-slate-500">Local, honest, and built to make you look bigger.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.t} className="card flex flex-col p-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-violet-400">
                <path d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <h3 className="mt-3 font-semibold text-white">{r.t}</h3>
              <p className="mt-2 text-sm text-slate-400">{r.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-8">
        <div className="card relative flex flex-col items-center gap-4 overflow-hidden border-violet-400/20 p-12 text-center">
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
          <h2 className="relative text-2xl font-bold text-white">Ready to set up your Galveston presence?</h2>
          <p className="relative max-w-xl text-slate-300">Create your account today, or talk it through with our local team first — your call.</p>
          <div className="relative flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup" className="btn-primary px-6 py-3 text-base">Create your account</Link>
            <Link href="/contact" className="btn-outline px-6 py-3 text-base">Book a free consultation</Link>
          </div>
          <a href={PHONE_HREF} className="relative mt-1 text-sm font-medium text-slate-300 hover:text-violet-300">
            Or call us: <span className="font-semibold text-white">{PHONE_DISPLAY}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
