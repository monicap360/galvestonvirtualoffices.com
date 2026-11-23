import Link from "next/link";
import { getMailboxPlans } from "@/lib/catalog";
import { subscribeMailbox } from "@/app/orders/actions";
import { money } from "@/lib/format";

export const metadata = { title: "Virtual Mailboxes" };

const compare = [
  { feature: "Real street address", them: "Shared national network", us: "A real Galveston address" },
  { feature: "Mail handling", them: "Manual scan only", us: "AI sorts bills, checks, legal & junk" },
  { feature: "Packages (Amazon, UPS, FedEx)", them: "Often extra fees or limits", us: "Accepted & held for local pickup" },
  { feature: "In-person pickup", them: "Not available", us: "Pick up locally during business hours" },
  { feature: "Support", them: "Call-center", us: "Real Galveston people who answer" },
  { feature: "Beyond the mailbox", them: "Mailbox only", us: "Assistant, office, address & marketing too" },
];

export default async function MailboxesPage({ searchParams }: PageProps<"/mailboxes">) {
  const [plans, { plan, error }] = await Promise.all([getMailboxPlans(), searchParams]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold text-white">AI-powered virtual mailboxes</h1>
        <p className="mt-3 text-slate-400">
          Get a real Galveston street address for your mail <em>and</em> packages. We accept letters and parcels —
          including Amazon, UPS, and FedEx — photograph them, sort with AI, and notify you instantly. Pick up in
          person at our Galveston location, or have us scan, forward, or shred.
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Note: a notarized USPS Form 1583 is required to receive mail on your behalf — we&apos;ll walk you through it after signup.
        </p>
      </header>

      {/* vs a typical digital mailbox */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white">More than a digital mailbox</h2>
        <div className="card mt-6 overflow-hidden p-0">
          <div className="grid grid-cols-3 border-b border-white/10 bg-white/5 text-sm font-semibold">
            <div className="p-4"></div>
            <div className="p-4 text-slate-300">Typical digital mailbox</div>
            <div className="p-4 text-violet-300">Galveston Virtual Mailbox</div>
          </div>
          {compare.map((row) => (
            <div key={row.feature} className="grid grid-cols-3 border-b border-white/5 text-sm last:border-0">
              <div className="p-4 font-medium text-white">{row.feature}</div>
              <div className="p-4 text-slate-400">{row.them}</div>
              <div className="p-4 text-slate-200">✓ {row.us}</div>
            </div>
          ))}
        </div>
      </section>

      <h2 className="mt-14 text-2xl font-bold text-white">Choose your plan</h2>
      <p className="mt-2 text-sm text-slate-400">After you submit, we’ll provide a first-month invoice with business-check payment instructions.</p>
      {typeof error === "string" && <p role="alert" className="mt-3 text-sm text-amber-300">{error === "failed" ? "We couldn’t save your subscription. Please try again or contact us." : "That plan couldn’t be selected. Please choose an available plan below."}</p>}
      {plans.length === 0 ? (
        <p className="mt-6 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 px-4 py-3">
          No plans listed yet. (Run the seed file, then refresh.)
        </p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {plans.map((p, i) => (
            <div id={`plan-${p.id}`} key={p.id} className={`card flex scroll-mt-6 flex-col p-6 ${p.id === plan || i === 1 ? "ring-1 ring-violet-400/50" : ""}`}>
              {i === 1 && <span className="badge mb-2 w-fit bg-gradient-to-br from-indigo-400 to-violet-500 text-slate-950">Most popular</span>}
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{p.description}</p>
              <div className="mt-4 text-3xl font-bold text-white">
                {money(p.price_cents)}<span className="text-base font-normal text-slate-400">/{p.interval}</span>
              </div>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-300">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-violet-300">✓</span>{f}</li>
                ))}
              </ul>
              <Link href={{ pathname: "/mailboxes/signup", query: { plan: p.id } }} className="btn-primary mt-6 w-full text-center">
                Sign up as a guest
              </Link>
              <form action={subscribeMailbox} className="mt-2">
                <input type="hidden" name="plan_id" value={p.id} />
                <button className="btn-outline w-full">Continue with an account</button>
              </form>
            </div>
          ))}
        </div>
      )}

      <div className="card mt-14 flex flex-col items-center gap-4 border-violet-400/20 p-10 text-center">
        <h2 className="text-2xl font-bold text-white">Questions about your mail setup?</h2>
        <p className="max-w-xl text-slate-300">Talk to a local team member — we&apos;ll help you pick the right plan and walk you through Form 1583.</p>
        <Link href="/contact" className="btn-primary px-6 py-3 text-base">Book a free consultation</Link>
      </div>
    </div>
  );
}
