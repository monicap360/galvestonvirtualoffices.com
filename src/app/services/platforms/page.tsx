import Link from "next/link";
import { getServices } from "@/lib/catalog";
import { money } from "@/lib/format";
import { orderService } from "@/app/orders/actions";

export const metadata = { title: "Websites & Business Platforms" };

const compare = [
  { feature: "What you get", them: "A brochure website", us: "A website + an admin back office to run it" },
  { feature: "Customer accounts", them: "Rarely included", us: "Logins, dashboards & profiles built in" },
  { feature: "Payments & invoicing", them: "Bolt-on later", us: "Built into the platform" },
  { feature: "Proof it works", them: "Portfolio screenshots", us: "You're looking at one we built" },
];

const process = [
  { t: "Tell us what you need", d: "Share your goals, pages, and the workflows your business runs on." },
  { t: "We design & build", d: "A modern front-end plus the admin tools to manage customers, bookings, and payments." },
  { t: "Launch & support", d: "We deploy it, hand over the keys, and keep it running. Hosting and updates handled." },
];

export default async function PlatformsPage() {
  const services = await getServices("web_platform");

  return (
    <div>
      {/* Positioning hero */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300/80">Websites &amp; Business Platforms</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Not just a website — <span className="text-gradient">a platform that runs your business.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
          Most agencies hand you a pretty brochure site. We build your customer-facing website <em>and</em> the
          admin back office behind it — accounts, bookings, payments, and invoicing. The proof? You&apos;re using
          one of our platforms right now.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="#options" className="btn-primary px-6 py-3 text-base">See options</Link>
          <Link href="/contact" className="btn-outline px-6 py-3 text-base">Book a free consultation</Link>
        </div>
      </section>

      {/* Head-to-head */}
      <section className="mx-auto max-w-5xl px-4 pb-4">
        <h2 className="text-center text-2xl font-bold text-white">More than a web designer</h2>
        <div className="card mt-8 overflow-hidden p-0">
          <div className="grid grid-cols-3 border-b border-white/10 bg-white/5 text-sm font-semibold">
            <div className="p-4 text-slate-400"></div>
            <div className="p-4 text-slate-300">Typical agency</div>
            <div className="p-4 text-cyan-300">Galveston Platforms</div>
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

      {/* Options */}
      <section id="options" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl font-bold text-white">Build options</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {services.length === 0 && (
            <p className="rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 px-4 py-3 lg:col-span-2">
              No services listed yet. (Run the seed file, then refresh.)
            </p>
          )}
          {services.map((s) => (
            <div key={s.id} className="card flex flex-col p-6">
              <h3 className="text-xl font-semibold text-white">{s.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{s.tagline}</p>
              <div className="mt-4 text-sm text-slate-400">Starting at <span className="text-2xl font-bold text-white">{money(s.base_price_cents)}</span></div>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
                {s.features.map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-cyan-300">✓</span>{f}</li>
                ))}
              </ul>
              <form action={orderService} className="mt-6 space-y-3 border-t border-white/10 pt-4">
                <input type="hidden" name="service_id" value={s.id} />
                <div>
                  <label className="label" htmlFor={`biz-${s.id}`}>Business name</label>
                  <input id={`biz-${s.id}`} name="cfg_business_name" required className="input" />
                </div>
                <div>
                  <label className="label" htmlFor={`needs-${s.id}`}>What do you need built?</label>
                  <textarea id={`needs-${s.id}`} name="cfg_requirements" rows={3} className="input" placeholder="Pages, features, integrations…" />
                </div>
                <button className="btn-primary w-full">Request a quote</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <h2 className="text-center text-2xl font-bold text-white">How it works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {process.map((s, i) => (
            <div key={s.t} className="card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 font-bold text-slate-950">{i + 1}</div>
              <h3 className="mt-4 font-semibold text-white">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="card flex flex-col items-center gap-4 border-cyan-400/20 p-10 text-center">
          <h2 className="text-2xl font-bold text-white">Have a project in mind?</h2>
          <p className="max-w-xl text-slate-300">Tell us what you&apos;re building and we&apos;ll send a tailored quote — or book a free consultation to talk it through.</p>
          <Link href="/contact" className="btn-primary px-6 py-3 text-base">Book a free consultation</Link>
        </div>
      </section>
    </div>
  );
}
