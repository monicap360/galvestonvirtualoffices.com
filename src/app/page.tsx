import Link from "next/link";
import { getTenant } from "@/lib/tenant";

const offerings = [
  {
    href: "/virtual-assistants",
    title: "Managed Virtual Assistants",
    blurb:
      "Get a dedicated, vetted virtual assistant — recruited, matched, and managed by us. Admin, scheduling, inbox, bookkeeping, customer follow-up, and more.",
    icon: "🧑‍💼",
  },
  {
    href: "/mailboxes",
    title: "AI Virtual Mailbox",
    blurb:
      "A real Galveston street address. We receive, photograph, and AI-sort your mail — bills, checks, legal, junk — and you manage it all from your dashboard.",
    icon: "📬",
  },
  {
    href: "/offices",
    title: "Offices & Meeting Rooms",
    blurb:
      "Private offices, day offices, desks, and meeting rooms. Book online by the day or month — perfect for travelers, remote teams, and growing businesses.",
    icon: "🏢",
  },
  {
    href: "/services/marketing",
    title: "AI Marketing Assistants",
    blurb:
      "A customized, always-on assistant that manages your Google profile, reviews, social posts, local SEO, and an AI website chatbot.",
    icon: "🤖",
  },
  {
    href: "/services/platforms",
    title: "Websites & Business Platforms",
    blurb:
      "We build your customer-facing website plus an admin back office — accounts, bookings, payments, and invoicing — like this very platform.",
    icon: "🛠️",
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
      <section className="relative overflow-hidden bg-gradient-to-b from-cyan-50 to-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <span className="badge bg-cyan-100 text-cyan-800">Galveston · Texas Gulf Coast</span>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-cyan-700">
            Managed Virtual Assistants &amp; Business Support
          </p>
          <h1 className="mx-auto mt-2 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            A dedicated virtual assistant — plus everything else your business needs
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            {tenant?.name ?? "Galveston Virtual Offices"} recruits, vets, and manages a virtual assistant matched
            to your business — backed by a real Texas address, AI-powered mailbox, offices, marketing, and custom
            platforms. Sign up online — pay by business check so every account is verified and legitimate.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/virtual-assistants/request" className="btn-primary px-6 py-3 text-base">Request an assistant</Link>
            <Link href="/pricing" className="btn-outline px-6 py-3 text-base">See pricing</Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">No long-term contracts · Cancel anytime · Real local team</p>
        </div>
      </section>

      {/* Offerings */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-slate-900">Everything to run your business remotely</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Pick one service or bundle them all. Built for entrepreneurs, travelers, cruisers, and Gulf Coast businesses.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {offerings.map((o) => (
            <Link key={o.href} href={o.href} className="card group p-6 transition hover:shadow-md">
              <div className="text-3xl">{o.icon}</div>
              <h3 className="mt-3 text-xl font-semibold text-slate-900 group-hover:text-cyan-700">{o.title}</h3>
              <p className="mt-2 text-slate-600">{o.blurb}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-cyan-700">Learn more →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cruise / traveler niche */}
      <section className="bg-cyan-700 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-14 text-center">
          <h2 className="text-3xl font-bold">Cruising or traveling out of Galveston?</h2>
          <p className="max-w-2xl text-cyan-50">
            Never miss important mail or a package while you&apos;re away. We receive and hold everything,
            photograph it to your dashboard, and forward on request — so you can sail with peace of mind.
          </p>
          <Link href="/mailboxes" className="btn bg-white px-6 py-3 text-base font-semibold text-cyan-800 hover:bg-cyan-50">
            Set up your travel mailbox
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-slate-900">How it works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card p-6 text-center">
              <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-cyan-700 text-lg font-bold text-white">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-8">
        <div className="card flex flex-col items-center gap-4 bg-slate-900 p-10 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to set up your Galveston presence?</h2>
          <p className="max-w-xl text-slate-300">Create your account today and have your address and dashboard live in minutes.</p>
          <Link href="/signup" className="btn bg-cyan-500 px-6 py-3 text-base font-semibold text-white hover:bg-cyan-400">
            Create your account
          </Link>
        </div>
      </section>
    </div>
  );
}
