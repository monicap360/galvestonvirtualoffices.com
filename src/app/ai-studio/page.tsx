import Link from "next/link";
import { getServices } from "@/lib/catalog";
import { orderService } from "@/app/orders/actions";
import { price } from "@/lib/format";

export const metadata = { title: "AI Studio" };

export default async function AiStudioPage() {
  const products = await getServices("ai_product");

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300/80">AI Studio</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Subscribe to <span className="text-gradient">AI agents</span> that run parts of your business
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
          Pick the AI agents you need — receptionist, lead follow-up, reviews, social, content, knowledge — and
          we set them up, trained on your business. Add or cancel any time. No long-term contracts.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="#agents" className="btn-primary px-6 py-3 text-base">Browse AI agents</Link>
          <Link href="/contact" className="btn-outline px-6 py-3 text-base">Book a free demo</Link>
        </div>
      </section>

      {/* Marketplace */}
      <section id="agents" className="mx-auto max-w-6xl px-4 pb-16">
        {products.length === 0 && (
          <p className="rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 px-4 py-3">
            No AI agents listed yet. (Run the 0004 migration in Supabase, then refresh.)
          </p>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((s) => (
            <div key={s.id} className="card flex flex-col p-6 transition-all hover:border-violet-400/30 hover:shadow-[0_0_40px_-12px_rgba(167,139,250,0.35)]">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="M8.25 12h.008v.008H8.25V12Zm3.75 0h.008v.008H12V12Zm3.75 0h.008v.008h-.008V12ZM21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.555-.337A5.97 5.97 0 0 1 5.41 20.97a5.97 5.97 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
              </span>
              <h2 className="mt-4 text-lg font-semibold text-white">{s.name}</h2>
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
                <button className="btn-primary w-full">Subscribe</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="card flex flex-col items-center gap-4 border-violet-400/20 p-10 text-center">
          <h2 className="text-2xl font-bold text-white">Not sure which agents you need?</h2>
          <p className="max-w-xl text-slate-300">Book a free demo — we&apos;ll map your workflows and recommend the AI agents that&apos;ll save you the most time.</p>
          <Link href="/contact" className="btn-primary px-6 py-3 text-base">Book a free demo</Link>
        </div>
      </section>
    </div>
  );
}
