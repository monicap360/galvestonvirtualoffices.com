type Props = {
  steps: string[];
};

export default function WorkflowPanel({ steps }: Props) {
  return (
    <div className="rounded-3xl border border-cyan-300/10 bg-gradient-to-br from-cyan-300/[0.035] to-violet-400/[0.035] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Prebuilt Workflow</p>
          <h2 className="mt-1 text-lg font-semibold text-white">How this agent works out of the box</h2>
        </div>
        <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.05] px-2.5 py-1 text-[11px] font-semibold text-emerald-200">
          Ready to customize
        </span>
      </div>

      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <li key={`${index}-${step}`} className="flex gap-3 rounded-2xl border border-white/10 bg-black/10 p-3">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-violet-300/20 bg-violet-400/10 text-xs font-bold text-violet-100">
              {index + 1}
            </span>
            <p className="pt-0.5 text-sm leading-6 text-slate-300">{step}</p>
          </li>
        ))}
      </ol>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        This workflow is a safe starting blueprint. Your business details and real connected systems control what can actually run live.
      </p>
    </div>
  );
}
