import Link from "next/link";
import type { ReadinessResult } from "@/lib/ai-studio/config";

type Props = {
  orderId: string;
  serviceName: string;
  businessName: string;
  orderStatus: string;
  readiness: ReadinessResult;
  createdAt: string;
};

function operationalLabel(orderStatus: string, readiness: ReadinessResult) {
  if (orderStatus === "active") return "Active";
  if (orderStatus === "cancelled") return "Cancelled";
  if (orderStatus === "completed") return "Completed";
  return readiness.label;
}

export default function AgentStatusCard({ orderId, serviceName, businessName, orderStatus, readiness, createdAt }: Props) {
  const label = operationalLabel(orderStatus, readiness);
  const nextItem = readiness.blockingItems[0] || readiness.recommendedItems[0];

  return (
    <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-300">Digital employee</p>
            <h2 className="mt-1 text-xl font-bold text-white">{serviceName}</h2>
            <p className="mt-1 text-sm text-slate-400">{businessName || "Business setup not finished"}</p>
          </div>
          <div className="sm:text-right">
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${orderStatus === "active" ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200" : "border-amber-300/20 bg-amber-300/10 text-amber-200"}`}>{label}</span>
            <p className="mt-2 text-xs text-slate-600">Started {new Date(createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">Readiness</span>
              <span className="font-bold text-white">{readiness.score}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${readiness.score}%` }} />
            </div>
            {nextItem && <p className="mt-2 text-xs text-slate-500">Next: {nextItem}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/dashboard/agents/${orderId}`} className="btn-primary px-4 py-2 text-xs">Customize</Link>
            <Link href={`/dashboard/agents/${orderId}#preview`} className="btn-outline px-4 py-2 text-xs">Preview</Link>
            <Link href={`/dashboard/agents/${orderId}#connections`} className="btn-outline px-4 py-2 text-xs">Connections</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
