import Link from "next/link";
import { getServices, getAssistants } from "@/lib/catalog";
import { price, money } from "@/lib/format";

export const metadata = { title: "Managed Virtual Assistants" };

const how = [
  { t: "Tell us what you need", d: "Submit a quick request describing the tasks, hours, and skills you're looking for." },
  { t: "We match & vet", d: "We recruit from our vetted pool and match a dedicated assistant to your business." },
  { t: "We manage it", d: "We handle onboarding, oversight, and backup coverage — you just delegate the work." },
];

export default async function VirtualAssistantsPage() {
  const [plans, assistants] = await Promise.all([getServices("virtual_assistant"), getAssistants()]);

  return (
    <div>
      <section>
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">Managed Virtual Assistants & Business Support</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white">A dedicated assistant, fully managed for you</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Stop drowning in admin. We recruit, vet, match, and manage a virtual assistant tailored to your
            business — so you get reliable help without the hassle of hiring.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/virtual-assistants/request" className="btn-primary px-6 py-3 text-base">Request an assistant</Link>
            <Link href="/virtual-assistants/apply" className="btn-outline px-6 py-3 text-base">Apply as an assistant</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-3xl font-bold text-white">How it works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {how.map((s, i) => (
            <div key={s.t} className="card p-6 text-center">
              <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-lg font-bold text-slate-950">{i + 1}</div>
              <h3 className="mt-4 text-lg font-semibold text-white">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-6xl px-4 pb-6">
        <h2 className="text-center text-3xl font-bold text-white">Plans</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {plans.map((p, i) => (
            <div key={p.id} className={`card flex flex-col p-6 ${i === 0 ? "ring-1 ring-cyan-400/50" : ""}`}>
              {i === 0 && <span className="badge mb-2 w-fit bg-cyan-400/10 text-cyan-200 border border-cyan-400/30">Most popular</span>}
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{p.tagline}</p>
              <div className="mt-4 text-3xl font-bold text-white">{price(p.base_price_cents, p.interval)}</div>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-300">
                {p.features.map((f) => <li key={f} className="flex gap-2"><span className="text-cyan-600">✓</span>{f}</li>)}
              </ul>
              <Link href="/virtual-assistants/request" className={`${i === 0 ? "btn-primary" : "btn-outline"} mt-6`}>Request this plan</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Roster */}
      {assistants.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-center text-3xl font-bold text-white">Meet a few of our assistants</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {assistants.map((a) => (
              <div key={a.id} className="card p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-cyan-400/15 text-xl font-bold text-cyan-200">
                    {a.name.charAt(0)}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{a.name}</p>
                    <p className="text-sm text-cyan-300">{a.headline}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-400">{a.bio}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {a.skills.slice(0, 5).map((s) => (
                    <span key={s} className="badge bg-white/5 text-slate-300">{s}</span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  {a.availability ? `${a.availability} · ` : ""}{money(a.hourly_rate_cents)}/hr equivalent
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="card flex flex-col items-center gap-4 bg-slate-900 border-cyan-400/20 p-10 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to delegate?</h2>
          <p className="max-w-xl text-slate-300">Tell us what you need and we&apos;ll match you with the right assistant.</p>
          <Link href="/virtual-assistants/request" className="btn bg-cyan-500 px-6 py-3 text-base font-semibold text-white hover:bg-cyan-400">
            Request an assistant
          </Link>
        </div>
      </section>
    </div>
  );
}
