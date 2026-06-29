import { getMailboxPlans } from "@/lib/catalog";
import { subscribeMailbox } from "@/app/orders/actions";
import { money } from "@/lib/format";

export const metadata = { title: "Virtual Mailboxes" };

export default async function MailboxesPage() {
  const plans = await getMailboxPlans();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900">AI-powered virtual mailboxes</h1>
        <p className="mt-3 text-slate-600">
          Get a real Galveston street address. We receive and photograph every piece of mail, sort it with AI,
          and notify you instantly. Pick up in person, or have us scan, forward, or shred.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Note: a notarized USPS Form 1583 is required to receive mail on your behalf — we&apos;ll walk you through it after signup.
        </p>
      </header>

      {plans.length === 0 ? (
        <p className="mt-10 rounded-lg bg-amber-50 px-4 py-3 text-amber-800">
          No plans listed yet. (Run the seed file, then refresh.)
        </p>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((p, i) => (
            <div key={p.id} className={`card flex flex-col p-6 ${i === 1 ? "ring-2 ring-cyan-600" : ""}`}>
              {i === 1 && <span className="badge mb-2 w-fit bg-cyan-700 text-white">Most popular</span>}
              <h2 className="text-lg font-semibold text-slate-900">{p.name}</h2>
              <p className="mt-1 text-sm text-slate-600">{p.description}</p>
              <div className="mt-4 text-3xl font-bold text-slate-900">
                {money(p.price_cents)}<span className="text-base font-normal text-slate-500">/{p.interval}</span>
              </div>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-700">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-cyan-600">✓</span>{f}</li>
                ))}
              </ul>
              <form action={subscribeMailbox} className="mt-6">
                <input type="hidden" name="plan_id" value={p.id} />
                <button className={i === 1 ? "btn-primary w-full" : "btn-outline w-full"}>Get this plan</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
