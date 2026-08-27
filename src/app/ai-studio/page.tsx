import Link from "next/link";
import { getServices } from "@/lib/catalog";
import { getAgentTemplate } from "@/lib/ai-studio/templates";
import AgentCard from "./agent-card";

export const metadata = { title: "AI Studio" };

export default async function AiStudioPage() {
  const products = await getServices("ai_product");
  const supported = products
    .map((service) => ({ service, template: getAgentTemplate(service.slug) }))
    .filter((entry): entry is { service: (typeof products)[number]; template: NonNullable<ReturnType<typeof getAgentTemplate>> } => Boolean(entry.template));

  return (
    <div className="overflow-hidden">
      <section className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 text-center sm:pt-20">
        <div className="pointer-events-none absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300/90">AI Studio · Digital Workforce</p>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl">
            Choose a prebuilt <span className="text-gradient">AI employee.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Customize how it works for your business. Preview it before you activate. Build a digital workforce that answers,
            sells, schedules, follows up, and keeps your business moving around the clock.
          </p>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-3 text-left">
            {[
              ["01", "Choose", "Start with a prebuilt specialist."],
              ["02", "Customize", "Train its voice, rules, and workflow."],
              ["03", "Preview", "See how it behaves before launch."],
            ].map(([number, title, copy]) => (
              <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-sm">
                <p className="text-[10px] font-bold tracking-[0.2em] text-violet-300">{number}</p>
                <p className="mt-2 text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 hidden text-xs leading-5 text-slate-400 sm:block">{copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="#agents" className="btn-primary px-6 py-3 text-base">Build my AI team</Link>
            <Link href="/contact" className="btn-outline px-6 py-3 text-base">Book a guided demo</Link>
          </div>
        </div>
      </section>

      <section id="agents" className="mx-auto max-w-7xl px-4 pb-20">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Your AI workforce</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Pick the job you want handled first.</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Every agent starts with a proven default workflow, then adapts to your hours, brand voice, offers, policies, and real connected systems.
          </p>
        </div>

        {supported.length === 0 ? (
          <p className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-amber-300">
            No supported AI agents are available right now.
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {supported.map(({ service, template }) => (
              <AgentCard key={service.id} service={service} template={template} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-slate-950/80 to-cyan-400/5 p-8 text-center shadow-2xl shadow-violet-950/20 sm:p-12">
          <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">AI workforce design session</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Not sure which agents you need?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-300">
              We&apos;ll map your workflows, identify where time and leads are leaking, and recommend the first AI agents that can make an immediate difference.
            </p>
            <Link href="/contact" className="btn-primary mt-6 inline-flex px-7 py-3 text-base">Book a free demo</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
