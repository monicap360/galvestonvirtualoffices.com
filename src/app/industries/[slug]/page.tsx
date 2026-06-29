import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { INDUSTRIES, getIndustry } from "@/lib/industries";
import { getServicesBySlugs } from "@/lib/catalog";
import { orderService } from "@/app/orders/actions";
import { price } from "@/lib/format";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return { title: "Industries" };
  return { title: industry.eyebrow, description: industry.metaDescription };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const agents = await getServicesBySlugs(industry.agentSlugs);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300/80">{industry.eyebrow}</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          {industry.headline}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">{industry.subhead}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="btn-primary px-6 py-3 text-base">Book a free demo</Link>
          <Link href="#agents" className="btn-outline px-6 py-3 text-base">See plans</Link>
        </div>
      </section>

      {/* Pains */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <h2 className="text-center text-2xl font-bold text-white">Sound familiar?</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {industry.pains.map((p) => (
            <div key={p} className="card flex items-start gap-3 p-5">
              <span className="mt-0.5 text-red-300">✕</span>
              <p className="text-slate-300">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="card border-cyan-400/20 p-8">
          <h2 className="text-2xl font-bold text-white">Here&apos;s what changes for {industry.name.toLowerCase()}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {industry.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-3 text-slate-200">
                <span className="mt-0.5 text-cyan-300">✓</span>
                {o}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recommended agents */}
      <section id="agents" className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-center text-2xl font-bold text-white">Recommended AI agents for {industry.name.toLowerCase()}</h2>
        {agents.length === 0 ? (
          <p className="mt-8 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 px-4 py-3 text-center">
            Plans appear once the AI Studio products are added in Supabase (run the 0004 migration).
          </p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((s) => (
              <div key={s.id} className="card flex flex-col p-6">
                <h3 className="text-lg font-semibold text-white">{s.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{s.tagline}</p>
                <div className="mt-4 text-2xl font-bold text-white">{price(s.base_price_cents, s.interval)}</div>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
                  {s.features.map((f) => (
                    <li key={f} className="flex gap-2"><span className="text-cyan-300">✓</span>{f}</li>
                  ))}
                </ul>
                <form action={orderService} className="mt-6 space-y-3 border-t border-white/10 pt-4">
                  <input type="hidden" name="service_id" value={s.id} />
                  <input type="hidden" name="cfg_industry" value={industry.name} />
                  <div>
                    <label className="label" htmlFor={`biz-${s.id}`}>Your business name</label>
                    <input id={`biz-${s.id}`} name="cfg_business_name" required className="input" />
                  </div>
                  <button className="btn-primary w-full">Subscribe</button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="card flex flex-col items-center gap-4 border-cyan-400/20 p-10 text-center">
          <h2 className="text-2xl font-bold text-white">See it work for your business</h2>
          <p className="max-w-xl text-slate-300">Book a free demo and we&apos;ll show your AI handling real calls and leads for {industry.name.toLowerCase()}.</p>
          <Link href="/contact" className="btn-primary px-6 py-3 text-base">Book a free demo</Link>
        </div>
      </section>
    </div>
  );
}
