import Link from "next/link";
import { INDUSTRIES } from "@/lib/industries";

export const metadata = {
  title: "AI for Your Industry",
  description: "Industry-specific AI front desks and agents for dental, hair salons, home services, law firms, and med spas.",
};

export default function IndustriesIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-fuchsia-300/80">Industries</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          AI built for <span className="text-gradient">your industry</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
          Your business isn&apos;t generic — your AI shouldn&apos;t be either. Pick your industry and see exactly how
          our AI agents handle your front desk, leads, and admin.
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {INDUSTRIES.map((i) => (
          <Link
            key={i.slug}
            href={`/industries/${i.slug}`}
            className="card group p-6 transition-all hover:-translate-y-0.5 hover:border-fuchsia-400/30 hover:shadow-[0_0_40px_-10px_rgba(232,121,249,0.35)]"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-300/80">{i.eyebrow}</p>
            <h2 className="mt-2 text-xl font-semibold text-white group-hover:text-fuchsia-300">{i.name}</h2>
            <p className="mt-2 text-sm text-slate-400">{i.headline}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-fuchsia-300">See the solution →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
