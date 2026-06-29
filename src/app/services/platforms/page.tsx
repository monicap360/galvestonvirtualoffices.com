import { getServices } from "@/lib/catalog";
import { orderService } from "@/app/orders/actions";
import { money } from "@/lib/format";

export const metadata = { title: "Websites & Business Platforms" };

export default async function PlatformsPage() {
  const services = await getServices("web_platform");

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold text-white">Websites & business platforms</h1>
        <p className="mt-3 text-slate-400">
          We build your customer-facing website <em>and</em> the admin back office to run it — accounts,
          bookings, payments, and invoicing. Tell us what you need and we&apos;ll send a tailored quote.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {services.length === 0 && (
          <p className="rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 px-4 py-3 lg:col-span-2">
            No services listed yet. (Run the seed file, then refresh.)
          </p>
        )}
        {services.map((s) => (
          <div key={s.id} className="card flex flex-col p-6">
            <h2 className="text-xl font-semibold text-white">{s.name}</h2>
            <p className="mt-1 text-sm text-slate-400">{s.tagline}</p>
            <div className="mt-4 text-sm text-slate-400">Starting at <span className="text-2xl font-bold text-white">{money(s.base_price_cents)}</span></div>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
              {s.features.map((f) => (
                <li key={f} className="flex gap-2"><span className="text-cyan-600">✓</span>{f}</li>
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
    </div>
  );
}
