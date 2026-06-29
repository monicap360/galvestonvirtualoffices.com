import Link from "next/link";
import { getMailboxPlans, getServices } from "@/lib/catalog";
import { price, money } from "@/lib/format";

export const metadata = { title: "Pricing" };

export default async function PricingPage() {
  const [plans, services] = await Promise.all([getMailboxPlans(), getServices()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-white">Simple, transparent pricing</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          Sign up online and pay by business check — it keeps every account verified and legitimate.
          No setup fees, no long-term contracts.
        </p>
      </header>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-white">Virtual mailboxes</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {plans.map((p) => (
            <div key={p.id} className="card p-5">
              <h3 className="font-semibold text-white">{p.name}</h3>
              <div className="mt-2 text-2xl font-bold">{money(p.price_cents)}<span className="text-sm font-normal text-slate-400">/{p.interval}</span></div>
              <Link href="/mailboxes" className="mt-3 inline-block text-sm font-semibold text-cyan-300 hover:underline">Choose plan →</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-white">Assistants, marketing, websites & bundles</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.id} className="card p-5">
              <h3 className="font-semibold text-white">{s.name}</h3>
              <p className="mt-1 text-xs text-slate-400">{s.tagline}</p>
              <div className="mt-2 text-2xl font-bold">{s.category === "web_platform" ? `from ${money(s.base_price_cents)}` : price(s.base_price_cents, s.interval)}</div>
              <Link
                href={
                  s.category === "web_platform"
                    ? "/services/platforms"
                    : s.category === "virtual_assistant"
                    ? "/virtual-assistants"
                    : s.category === "ai_assistant"
                    ? "/ai-assistant"
                    : "/services/marketing"
                }
                className="mt-3 inline-block text-sm font-semibold text-cyan-300 hover:underline"
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-white">Office space</h2>
        <p className="mt-2 text-slate-400">
          Day offices from <strong>$45/day</strong>, desks from <strong>$25/day</strong>, meeting rooms billed per day.{" "}
          <Link href="/offices" className="font-semibold text-cyan-300 hover:underline">View & book offices →</Link>
        </p>
      </section>
    </div>
  );
}
