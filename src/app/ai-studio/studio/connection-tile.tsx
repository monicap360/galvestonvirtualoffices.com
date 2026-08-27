import type { ConnectionState } from "@/lib/ai-studio/types";

type Props = {
  label: string;
  description: string;
  state: ConnectionState;
  blocking: boolean;
};

const copy: Record<ConnectionState, string> = {
  not_connected: "Not connected",
  needs_setup: "Needs setup",
  connected: "Connected",
};

export default function ConnectionTile({ label, description, state, blocking }: Props) {
  const live = state === "connected";
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${live ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200" : state === "needs_setup" ? "border-amber-300/20 bg-amber-300/10 text-amber-200" : "border-white/10 bg-white/[0.04] text-slate-400"}`}>
          {copy[state]}
        </span>
      </div>
      {!live && blocking && <p className="mt-3 text-[11px] font-medium text-amber-200/80">Required before live activation</p>}
    </div>
  );
}
