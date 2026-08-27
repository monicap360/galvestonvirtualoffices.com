import Link from "next/link";
import { price } from "@/lib/format";
import type { Service } from "@/lib/catalog";
import type { AgentTemplate } from "@/lib/ai-studio/types";
import AgentTry from "./agent-try";

type Props = {
  service: Service;
  template: AgentTemplate;
};

export default function AgentCard({ service, template }: Props) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-violet-950/30">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/70 to-transparent" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl transition group-hover:bg-violet-500/15" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-violet-200 shadow-inner shadow-white/5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12m0-12.72-2.12 2.12m-8.48 8.48-2.12 2.12" />
              <circle cx="12" cy="12" r="4.25" />
            </svg>
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.85)]" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">Prebuilt AI employee</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">{service.name}</h2>
          </div>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">{template.vertical}</span>
      </div>

      <p className="relative mt-4 min-h-12 text-sm leading-6 text-slate-300">{service.tagline}</p>

      <div className="relative mt-5 flex items-end justify-between gap-4 border-y border-white/10 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Launch from</p>
          <div className="mt-1 text-3xl font-black tracking-tight text-white">{price(service.base_price_cents, service.interval)}</div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Setup status</p>
          <p className="mt-1 inline-flex items-center gap-2 text-xs font-medium text-amber-200">
            <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,.65)]" />
            Customize before activation
          </p>
        </div>
      </div>

      <ul className="relative mt-5 space-y-2.5 text-sm text-slate-300">
        {service.features.slice(0, 6).map((feature) => (
          <li key={feature} className="flex gap-2.5">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-[11px] text-emerald-300">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
        <AgentTry name={service.name} tagline={service.tagline} description={service.description} />
        <Link href={`/ai-studio/${service.slug}/customize`} className="btn-primary flex items-center justify-center gap-2 text-center">
          Customize &amp; Subscribe
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
