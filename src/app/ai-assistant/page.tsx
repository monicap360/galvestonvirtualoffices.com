import Link from "next/link";
import { getServices } from "@/lib/catalog";
import { orderService } from "@/app/orders/actions";
import { price } from "@/lib/format";

export const metadata = { title: "AI Assistant" };

const does = [
  { t: "Answers instantly, 24/7", d: "Trained on your business, it replies to customer questions day or night — no missed leads after hours." },
  { t: "Captures & qualifies leads", d: "Collects contact details, asks the right questions, and alerts you the moment a hot lead comes in." },
  { t: "Books & follows up", d: "Schedules appointments, sends reminders, and hands off to your human team when a person is needed." },
];

// AI Assistant (software) vs Managed VA (human) — they're complementary, not competing.
const compare = [
  { feature: "Best for", ai: "Instant, 24/7, high-volume questions", va: "Judgment, calls, relationships, real work" },
  { feature: "Availability", ai: "Always on, every second", va: "Dedicated hours each week" },
  { feature: "Handles", ai: "FAQs, lead capture, booking", va: "Inbox, admin, bookkeeping, follow-up" },
  { feature: "Together", ai: "Catches & qualifies every lead…", va: "…then your VA closes the loop" },
];

export default async function AiAssistantPage() {
  const plans = await getServices("ai_assistant");

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300/80">AI Assistant</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          A <span className="text-gradient">24/7 AI assistant</span> that never misses a lead
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
          An always-on AI assistant trained on your business — it answers customer questions, captures and
          qualifies leads, books appointments, and hands off to your human team when it matters. Your website,
          working while you sleep.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="#plans" className="btn-primary px-6 py-3 text-base">See plans</Link>
          <Link href="/contact" className="btn-outline px-6 py-3 text-base">Book a free demo</Link>
        </div>
      </section>

      {/* What it does */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="grid gap-6 sm:grid-cols-3">
          {does.map((s) => (
            <div key={s.t} className="card p-6">
              <h3 className="font-semibold text-white">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Assistant vs Managed VA */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold text-white">AI Assistant or a human VA? Get both.</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-400">
          The AI catches and qualifies every lead instantly; your{" "}
          <Link href="/virtual-assistants" className="text-cyan-300 hover:underline">Managed VA</Link>{" "}
          does the work that needs a human. They&apos;re built to run together.
        </p>
        <div className="card mt-8 overflow-hidden p-0">
          <div className="grid grid-cols-3 border-b border-white/10 bg-white/5 text-sm font-semibold">
            <div className="p-4"></div>
            <div className="p-4 text-cyan-300">AI Assistant</div>
            <div className="p-4 text-slate-300">Managed VA (human)</div>
          </div>
          {compare.map((row) => (
            <div key={row.feature} className="grid grid-cols-3 border-b border-white/5 text-sm last:border-0">
              <div className="p-4 font-medium text-white">{row.feature}</div>
              <div className="p-4 text-slate-200">{row.ai}</div>
              <div className="p-4 text-slate-300">{row.va}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="mx-auto max-w-5xl px-4 pb-14">
        <h2 className="text-center text-2xl font-bold text-white">Plans</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {plans.length === 0 && (
            <p className="rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 px-4 py-3 md:col-span-2">
              No AI Assistant plans listed yet. (Run the 0003 migration in Supabase, then refresh.)
            </p>
          )}
          {plans.map((s, i) => (
            <div key={s.id} className={`card flex flex-col p-6 ${i === 1 ? "ring-1 ring-cyan-400/50" : ""}`}>
              {i === 1 && <span className="badge mb-2 w-fit bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-950">Most popular</span>}
              <h3 className="text-lg font-semibold text-white">{s.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{s.tagline}</p>
              <div className="mt-4 text-3xl font-bold text-white">{price(s.base_price_cents, s.interval)}</div>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
                {s.features.map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-cyan-300">✓</span>{f}</li>
                ))}
              </ul>
              <form action={orderService} className="mt-6 space-y-3 border-t border-white/10 pt-4">
                <input type="hidden" name="service_id" value={s.id} />
                <div>
                  <label className="label" htmlFor={`biz-${s.id}`}>Your business name</label>
                  <input id={`biz-${s.id}`} name="cfg_business_name" required className="input" />
                </div>
                <div>
                  <label className="label" htmlFor={`site-${s.id}`}>Website (optional)</label>
                  <input id={`site-${s.id}`} name="cfg_website" placeholder="https://" className="input" />
                </div>
                <button className="btn-primary w-full">Start this plan</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="card flex flex-col items-center gap-4 border-cyan-400/20 p-10 text-center">
          <h2 className="text-2xl font-bold text-white">See it answer your customers</h2>
          <p className="max-w-xl text-slate-300">Book a free demo and we&apos;ll show your AI assistant answering real questions about your business.</p>
          <Link href="/contact" className="btn-primary px-6 py-3 text-base">Book a free demo</Link>
        </div>
      </section>
    </div>
  );
}
