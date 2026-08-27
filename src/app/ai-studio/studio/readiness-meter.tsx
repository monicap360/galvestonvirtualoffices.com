import type { ReadinessResult } from "@/lib/ai-studio/config";

type Props = {
  readiness: ReadinessResult;
};

export default function ReadinessMeter({ readiness }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Readiness</p>
          <p className="mt-1 text-lg font-semibold text-white">{readiness.label}</p>
        </div>
        <div
          className="relative grid h-20 w-20 place-items-center rounded-full p-2"
          style={{ background: `conic-gradient(rgb(167 139 250) ${readiness.score * 3.6}deg, rgb(255 255 255 / 0.08) 0deg)` }}
          aria-label={`${readiness.score}% ready`}
        >
          <div className="grid h-full w-full place-items-center rounded-full bg-slate-950 text-lg font-black text-white">
            {readiness.score}%
          </div>
        </div>
      </div>

      {readiness.blockingItems.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-amber-300/15 bg-amber-300/[0.05] p-3">
          <p className="text-xs font-semibold text-amber-200">Next required setup</p>
          <p className="mt-1 text-sm text-slate-300">{readiness.blockingItems[0]}</p>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.05] p-3 text-sm text-emerald-200">
          All blocking setup items are complete.
        </div>
      )}
    </div>
  );
}
