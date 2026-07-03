import Link from "next/link";

export const metadata = {
  title: "Why Us vs. the Alternatives",
  description:
    "How Galveston Virtual Offices compares to national mailbox apps (iPostal1, Anytime Mailbox), big-brand virtual offices (Regus), and AI answering services (Ruby, Smith.ai) — a real local team, all-in-one, no contracts, and try-before-you-buy AI.",
};

type Cell = "yes" | "no" | "varies";
type Row = { feature: string; gvo: Cell; mailbox: Cell; office: Cell; ai: Cell };

const COLS = [
  { key: "gvo", label: "Galveston Virtual Offices", highlight: true },
  { key: "mailbox", label: "National mailbox apps", sub: "iPostal1, Anytime Mailbox" },
  { key: "office", label: "Big-brand offices", sub: "Regus, Spaces" },
  { key: "ai", label: "AI answering services", sub: "Ruby, Smith.ai" },
] as const;

const ROWS: Row[] = [
  { feature: "A real local Galveston team (not a call center)", gvo: "yes", mailbox: "no", office: "varies", ai: "no" },
  { feature: "Month-to-month — no long-term contract", gvo: "yes", mailbox: "yes", office: "no", ai: "yes" },
  { feature: "Real street address (not a PO box)", gvo: "yes", mailbox: "varies", office: "yes", ai: "no" },
  { feature: "Packages accepted & photographed same day", gvo: "yes", mailbox: "varies", office: "varies", ai: "no" },
  { feature: "Two blocks from the cruise terminal", gvo: "yes", mailbox: "no", office: "no", ai: "no" },
  { feature: "24/7 AI phone line & specialized agents", gvo: "yes", mailbox: "no", office: "no", ai: "yes" },
  { feature: "Try the AI live before you buy", gvo: "yes", mailbox: "no", office: "no", ai: "no" },
  { feature: "Address + mail + AI + offices in one place", gvo: "yes", mailbox: "no", office: "varies", ai: "no" },
  { feature: "Transparent pricing, no per-call fees", gvo: "yes", mailbox: "yes", office: "varies", ai: "no" },
];

function Mark({ v }: { v: Cell }) {
  if (v === "yes")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-5 w-5 text-emerald-400" aria-label="Yes">
        <path d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    );
  if (v === "no")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-5 w-5 text-slate-600" aria-label="No">
        <path d="M6 18 18 6M6 6l12 12" />
      </svg>
    );
  return <span className="mx-auto block text-center text-sm text-amber-400/80" aria-label="Varies">~</span>;
}

const cards = [
  {
    title: "vs. national mailbox apps",
    sub: "iPostal1, Anytime Mailbox, PostScan",
    body: "They're faceless, self-serve apps — you're a login and a monthly fee. We're a real Galveston team that receives, photographs, and holds your mail and packages, and you can walk in and talk to a person. Plus you get AI phone answering and agents they simply don't offer.",
  },
  {
    title: "vs. big-brand virtual offices",
    sub: "Regus, Spaces",
    body: "The national brands lock you into annual terms, nickel-and-dime add-ons, and an impersonal front desk that doesn't know you. We're month-to-month, priced plainly, and run by locals on the island — with AI and mailbox handling built in, not bolted on.",
  },
  {
    title: "vs. AI answering services",
    sub: "Ruby ($235/mo humans), Smith.ai",
    body: "Standalone answering services do one thing and charge per call — Ruby's live receptionists start around $235/mo. Our AI phone line is fully managed and trained on your business, with no per-call fees — and you can test it live before you pay. It also comes alongside your address, mailbox, and other agents.",
  },
];

export default function WhyUsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300/80">Why choose us</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          One local hub instead of <span className="text-gradient">four faceless vendors</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
          Most businesses stitch together a mailbox app, an office brand, and a separate answering service. We&apos;re all
          of it — with a real Galveston team, AI you can test before you buy, and no long-term contracts.
        </p>
      </header>

      {/* Comparison table */}
      <div className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="w-[34%] p-3"></th>
              {COLS.map((c) => (
                <th
                  key={c.key}
                  className={`p-3 text-center align-bottom ${
                    "highlight" in c && c.highlight
                      ? "rounded-t-xl border-x border-t border-violet-400/40 bg-violet-500/10"
                      : ""
                  }`}
                >
                  <span className={`block text-sm font-bold ${"highlight" in c && c.highlight ? "text-violet-200" : "text-white"}`}>{c.label}</span>
                  {"sub" in c && c.sub && <span className="mt-0.5 block text-xs font-normal text-slate-500">{c.sub}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.feature}>
                <td className="border-b border-white/5 p-3 font-medium text-slate-200">{r.feature}</td>
                {(["gvo", "mailbox", "office", "ai"] as const).map((k) => (
                  <td
                    key={k}
                    className={`border-b border-white/5 p-3 ${
                      k === "gvo" ? "border-x border-violet-400/40 bg-violet-500/10" : ""
                    } ${k === "gvo" && i === ROWS.length - 1 ? "rounded-b-xl border-b" : ""}`}
                  >
                    <Mark v={r[k]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">✓ yes · ~ varies by provider/plan · ✕ no</p>

      {/* Category call-outs */}
      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="card p-6">
            <h2 className="text-lg font-semibold text-white">{c.title}</h2>
            <p className="mt-0.5 text-xs text-slate-500">{c.sub}</p>
            <p className="mt-3 text-sm text-slate-400">{c.body}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-16">
        <div className="card flex flex-col items-center gap-4 border-violet-400/20 p-10 text-center">
          <h2 className="text-2xl font-bold text-white">See the difference for yourself</h2>
          <p className="max-w-xl text-slate-300">Try any AI agent live, set up your Galveston address, or talk to a real local person — no contracts, cancel anytime.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/ai-studio" className="btn-primary px-6 py-3 text-base">Try an AI agent free</Link>
            <Link href="/pricing" className="btn-outline px-6 py-3 text-base">See pricing</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
