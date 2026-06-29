import { getServices } from "@/lib/catalog";
import { orderService } from "@/app/orders/actions";
import { price } from "@/lib/format";

export const metadata = { title: "AI Marketing Assistants" };

export default async function MarketingServicesPage() {
  const marketing = await getServices("marketing_assistant");
  const bundles = await getServices("bundle");
  const services = [...marketing, ...bundles];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold text-white">Customized AI marketing assistants</h1>
        <p className="mt-3 text-slate-400">
          An always-on assistant tailored to your business — managing your Google Business Profile, reviews,
          social posts, local SEO, and an AI chatbot for your website. Tell us about your business and we&apos;ll
          configure it for you.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
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
            <h2 className="mt-2 text-lg font-semibold text-white">{s.name}</h2>
            <p className="mt-1 text-sm text-slate-400">{s.tagline}</p>
            <div className="mt-4 text-2xl font-bold text-white">{price(s.base_price_cents, s.interval)}</div>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
              {s.features.map((f) => (
                <li key={f} className="flex gap-2"><span className="text-cyan-600">✓</span>{f}</li>
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
    </div>
  );
}
