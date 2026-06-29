import Link from "next/link";
import { getTenant } from "@/lib/tenant";

// Minimalist line icons (Heroicons outline) — no clip art.
const ICONS: Record<string, string> = {
  assistant: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  mail: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
  office: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
  marketing: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z",
  platform: "m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9.75 6h13.5A2.25 2.25 0 0 0 21 18.75V6A2.25 2.25 0 0 0 18.75 3.75H5.25A2.25 2.25 0 0 0 3 6v12.75c0 .621.504 1.125 1.125 1.125Z",
};

function Icon({ name }: { name: string }) {
  return (
    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-[0_0_24px_-8px_rgba(34,211,238,0.5)]">
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

export default async function HomePage() {
  const tenant = await getTenant();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <span className="badge border border-cyan-400/30 bg-cyan-400/10 text-cyan-200">
            ◇ Galveston · Texas Gulf Coast
          </span>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300/80">
            Managed Virtual Assistants &amp; Business Support
          </p>
          <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            A dedicated virtual assistant —{" "}
            <span className="text-gradient">plus everything</span> your business needs
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            {tenant?.name ?? "Galveston Virtual Offices"} recruits, vets, and manages a virtual assistant matched
            to your business — backed by a real Texas address, AI-powered mailbox, offices, marketing, and custom
            platforms. Sign up online — pay by business check so every account is verified and legitimate.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/virtual-assistants/request" className="btn-primary px-6 py-3 text-base">Request an assistant</Link>
            <Link href="/pricing" className="btn-outline px-6 py-3 text-base">See pricing</Link>
          </div>
          <p className="mt-5 text-sm text-slate-400">No long-term contracts · Cancel anytime · Real local team</p>
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
              className="card group p-6 transition-all hover:-translate-y-0.5 hover:border-cyan-400/30 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.35)]"
            >
              <Icon name={o.icon} />
              <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-cyan-300">{o.title}</h3>
              <p className="mt-2 text-slate-400">{o.blurb}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-cyan-300">Learn more →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cruise / traveler niche */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="card relative overflow-hidden bg-gradient-to-br from-cyan-500/15 to-indigo-500/15 p-12 text-center">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
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
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-lg font-bold text-slate-950 shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)]">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-8">
        <div className="card relative flex flex-col items-center gap-4 overflow-hidden border-cyan-400/20 p-12 text-center">
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
          <h2 className="relative text-2xl font-bold text-white">Ready to set up your Galveston presence?</h2>
          <p className="relative max-w-xl text-slate-300">Create your account today and have your address and dashboard live in minutes.</p>
          <Link href="/signup" className="btn-primary relative px-6 py-3 text-base">Create your account</Link>
        </div>
      </section>
    </div>
  );
}
