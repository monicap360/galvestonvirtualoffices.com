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
};

function Icon({ name }: { name: string }) {
  return (
    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-300 shadow-[0_0_24px_-8px_rgba(232,121,249,0.5)]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d={ICONS[name]} />
      </svg>
    </span>
  );
}

const offerings = [
  {
    href: "/virtual-assistants",
    title: "Managed Virtual Assistants",
    blurb:
      "Get a dedicated, vetted virtual assistant — recruited, matched, and managed by us. Admin, scheduling, inbox, bookkeeping, customer follow-up, and more.",
    icon: "assistant",
  },
  {
    href: "/ai-assistant",
    title: "AI Assistant",
    blurb:
      "A 24/7 AI assistant trained on your business — answers customer questions, captures and qualifies leads, books appointments, and hands off to your human team.",
    icon: "ai",
  },
  {
    href: "/mailboxes",
    title: "AI Virtual Mailbox",
    blurb:
      "A real Galveston street address. We receive, photograph, and AI-sort your mail — bills, checks, legal, junk — and you manage it all from your dashboard.",
    icon: "mail",
  },
  {
    href: "/offices",
    title: "Offices & Meeting Rooms",
    blurb:
      "Private offices, day offices, desks, and meeting rooms. Book online by the day or month — perfect for travelers, remote teams, and growing businesses.",
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

// NOTE: replace these sample quotes with real client testimonials before launch.
const testimonials = [
  { quote: "My assistant handles my inbox and scheduling so I can actually run my business. Best decision I made this year.", name: "Sample Client", role: "Realtor, Galveston" },
  { quote: "I travel constantly and never miss a check or package now — everything's photographed to my dashboard the day it arrives.", name: "Sample Client", role: "Cruise traveler & consultant" },
  { quote: "Address, mailbox, and marketing in one place, and a real local team that picks up the phone. Couldn't be happier.", name: "Sample Client", role: "LLC owner, Houston" },
];

const PHONE_DISPLAY = "(409) 555-0123"; // TODO: replace with your real business number
const PHONE_HREF = "tel:+14095550123";

// Honest, factual trust signals (true for a new business — no fabricated social proof).
const trustSignals = [
  "Real Galveston street address",
  "USPS Form 1583 compliant",
  "Business-check verified accounts",
  "No long-term contracts",
  "Local Gulf Coast team",
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
          <span className="badge border border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200">
            ◇ Galveston · Texas Gulf Coast
          </span>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-fuchsia-300/80">
            Built for Women Entrepreneurs · Galveston, TX
          </p>
          <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            The AI-powered business hub{" "}
            <span className="text-gradient">built for women</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            {tenant?.name ?? "Galveston Virtual Offices"} gives women entrepreneurs everything to launch, run, and
            grow — a dedicated assistant, a real Texas address, AI-powered mailbox, offices, AI agents, and marketing.
            Sign up online; pay by business check so every account is verified and legitimate.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/virtual-assistants/request" className="btn-primary px-6 py-3 text-base">Request an assistant</Link>
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-fuchsia-400">
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
              className="card group p-6 transition-all hover:-translate-y-0.5 hover:border-fuchsia-400/30 hover:shadow-[0_0_40px_-10px_rgba(232,121,249,0.35)]"
            >
              <Icon name={o.icon} />
              <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-fuchsia-300">{o.title}</h3>
              <p className="mt-2 text-slate-400">{o.blurb}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-fuchsia-300">Learn more →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cruise / traveler niche */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="card relative overflow-hidden bg-gradient-to-br from-fuchsia-500/15 to-violet-500/15 p-12 text-center">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-fuchsia-400/20 blur-3xl" />
          <h2 className="relative text-3xl font-bold text-white">Cruising or traveling out of Galveston?</h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-slate-300">
            Never miss important mail or a package while you&apos;re away. We receive and hold everything,
            photograph it to your dashboard, and forward on request — so you can sail with peace of mind.
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
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-500 text-lg font-bold text-slate-950 shadow-[0_0_24px_-6px_rgba(232,121,249,0.7)]">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-white">What our clients say</h2>
        <p className="mt-2 text-center text-sm text-slate-500">Real Gulf Coast businesses, real results.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.quote} className="card flex flex-col p-6">
              <div className="text-fuchsia-300" aria-hidden>★★★★★</div>
              <blockquote className="mt-3 flex-1 text-slate-300">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 border-t border-white/10 pt-4">
                <span className="block font-semibold text-white">{t.name}</span>
                <span className="block text-sm text-slate-400">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-8">
        <div className="card relative flex flex-col items-center gap-4 overflow-hidden border-fuchsia-400/20 p-12 text-center">
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
          <h2 className="relative text-2xl font-bold text-white">Ready to set up your Galveston presence?</h2>
          <p className="relative max-w-xl text-slate-300">Create your account today, or talk it through with our local team first — your call.</p>
          <div className="relative flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup" className="btn-primary px-6 py-3 text-base">Create your account</Link>
            <Link href="/contact" className="btn-outline px-6 py-3 text-base">Book a free consultation</Link>
          </div>
          <a href={PHONE_HREF} className="relative mt-1 text-sm font-medium text-slate-300 hover:text-fuchsia-300">
            Or call us: <span className="font-semibold text-white">{PHONE_DISPLAY}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
