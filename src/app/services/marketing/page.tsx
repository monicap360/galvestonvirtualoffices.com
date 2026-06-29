import Link from "next/link";
import { getServices } from "@/lib/catalog";
import { orderService } from "@/app/orders/actions";
import { price } from "@/lib/format";

export const metadata = { title: "AI Marketing Assistants" };

const compare = [
  { feature: "Time to launch", them: "Weeks of onboarding & meetings", us: "Configured for you in days" },
  { feature: "Pricing", them: "Retainer + a cut of your ad spend", us: "Flat, transparent monthly price" },
  { feature: "Contracts", them: "Often long-term", us: "Cancel anytime — no lock-in" },
  { feature: "What you actually get", them: "Marketing only", us: "Marketing + assistant + address + mailbox + office" },
  { feature: "How it runs", them: "Account managers & status calls", us: "AI-powered & always-on, with a real local team" },
];

const process = [
  { t: "Tell us about your business", d: "A few questions about your goals, services, and where your customers are." },
  { t: "We configure your AI assistant", d: "We set up your Google profile, reviews, posts, local SEO, and website chatbot — tuned to your brand." },
  { t: "It runs — you get results", d: "Your marketing runs every day. You get clear monthly reports and a local team a phone call away." },
];

export default async function MarketingServicesPage() {
  const marketing = await getServices("marketing_assistant");
  const bundles = await getServices("bundle");
  const services = [...marketing, ...bundles];

  return (
    <div>
      {/* Positioning hero */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300/80">AI Marketing Assistants</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Run your business. We&apos;ll run the <span className="text-gradient">marketing behind it.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
          An AI-powered marketing assistant — Google Business Profile, reviews, local SEO, social posts, and a
          website chatbot — managed by a real Galveston team. All the muscle of a full agency, none of the bloat,
          retainers, or long-term contracts.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="#plans" className="btn-primary px-6 py-3 text-base">See plans</Link>
          <Link href="/contact" className="btn-outline px-6 py-3 text-base">Book a free strategy call</Link>
        </div>
      </section>

      {/* Head-to-head vs a traditional agency */}
      <section className="mx-auto max-w-5xl px-4 pb-4">
        <h2 className="text-center text-2xl font-bold text-white">Why businesses switch from a traditional agency</h2>
        <div className="card mt-8 overflow-hidden p-0">
          <div className="grid grid-cols-3 border-b border-white/10 bg-white/5 text-sm font-semibold">
            <div className="p-4 text-slate-400"></div>
            <div className="p-4 text-slate-300">Traditional agency</div>
            <div className="p-4 text-violet-300">Galveston AI Marketing</div>
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

      {/* Plans */}
      <section id="plans" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl font-bold text-white">Pick your plan</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {services.length === 0 && (
            <p className="rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 px-4 py-3 lg:col-span-3">
              No services listed yet. (Run the seed file, then refresh.)
            </p>
          )}
          {services.map((s) => (
            <div key={s.id} className="card flex flex-col p-6">
              <span className="badge w-fit bg-white/5 text-slate-300">
                {s.category === "bundle" ? "Bundle" : "Marketing"}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-white">{s.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{s.tagline}</p>
              <div className="mt-4 text-2xl font-bold text-white">{price(s.base_price_cents, s.interval)}</div>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
                {s.features.map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-violet-300">✓</span>{f}</li>
                ))}
              </ul>
              <form action={orderService} className="mt-6 space-y-3 border-t border-white/10 pt-4">
                <input type="hidden" name="service_id" value={s.id} />
                <div>
                  <label className="label" htmlFor={`biz-${s.id}`}>Your business name</label>
                  <input id={`biz-${s.id}`} name="cfg_business_name" required className="input" />
                </div>
                <div>
                  <label className="label" htmlFor={`goal-${s.id}`}>Main goal</label>
                  <input id={`goal-${s.id}`} name="cfg_goal" placeholder="e.g. more local leads" className="input" />
                </div>
                <button className="btn-primary w-full">Start this plan</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <h2 className="text-center text-2xl font-bold text-white">How it works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {process.map((s, i) => (
            <div key={s.t} className="card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 font-bold text-slate-950">{i + 1}</div>
              <h3 className="mt-4 font-semibold text-white">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="card flex flex-col items-center gap-4 border-violet-400/20 p-10 text-center">
          <h2 className="text-2xl font-bold text-white">Not sure which plan fits?</h2>
          <p className="max-w-xl text-slate-300">Book a free strategy call — we&apos;ll look at your business and recommend the right setup. No pressure, no jargon.</p>
          <Link href="/contact" className="btn-primary px-6 py-3 text-base">Book a free strategy call</Link>
        </div>
      </section>
    </div>
  );
}
