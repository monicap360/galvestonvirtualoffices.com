import { titleCase } from "@/lib/format";

const colors: Record<string, string> = {
  // mail
  received: "bg-blue-400/15 text-blue-300",
  ready_for_pickup: "bg-amber-400/15 text-amber-300",
  picked_up: "bg-fuchsia-400/15 text-fuchsia-300",
  forwarded: "bg-violet-400/15 text-violet-300",
  shredded: "bg-white/10 text-slate-300",
  // generic order/booking/invoice
  pending: "bg-amber-400/15 text-amber-300",
  awaiting_payment: "bg-amber-400/15 text-amber-300",
  confirmed: "bg-fuchsia-400/15 text-fuchsia-300",
  active: "bg-fuchsia-400/15 text-fuchsia-300",
  paid: "bg-fuchsia-400/15 text-fuchsia-300",
  inquiry: "bg-blue-400/15 text-blue-300",
  quoted: "bg-violet-400/15 text-violet-300",
  in_progress: "bg-fuchsia-400/15 text-fuchsia-300",
  completed: "bg-fuchsia-400/15 text-fuchsia-300",
  cancelled: "bg-white/10 text-slate-300",
  past_due: "bg-red-400/15 text-red-300",
  void: "bg-white/10 text-slate-300",
  draft: "bg-white/10 text-slate-300",
  // VA applications + client requests
  new: "bg-blue-400/15 text-blue-300",
  matching: "bg-fuchsia-400/15 text-fuchsia-300",
  matched: "bg-violet-400/15 text-violet-300",
  closed: "bg-white/10 text-slate-300",
  applied: "bg-blue-400/15 text-blue-300",
  screening: "bg-amber-400/15 text-amber-300",
  approved: "bg-fuchsia-400/15 text-fuchsia-300",
  rejected: "bg-red-400/15 text-red-300",
};

export default function StatusBadge({ status }: { status: string }) {
  return <span className={`badge ${colors[status] ?? "bg-white/10 text-slate-300"}`}>{titleCase(status)}</span>;
}
