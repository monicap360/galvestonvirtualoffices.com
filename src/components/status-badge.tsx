import { titleCase } from "@/lib/format";

const colors: Record<string, string> = {
  // mail
  received: "bg-blue-100 text-blue-800",
  ready_for_pickup: "bg-amber-100 text-amber-800",
  picked_up: "bg-emerald-100 text-emerald-800",
  forwarded: "bg-violet-100 text-violet-800",
  shredded: "bg-slate-200 text-slate-700",
  // generic order/booking/invoice
  pending: "bg-amber-100 text-amber-800",
  awaiting_payment: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  active: "bg-emerald-100 text-emerald-800",
  paid: "bg-emerald-100 text-emerald-800",
  inquiry: "bg-blue-100 text-blue-800",
  quoted: "bg-violet-100 text-violet-800",
  in_progress: "bg-cyan-100 text-cyan-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-slate-200 text-slate-600",
  past_due: "bg-red-100 text-red-700",
  void: "bg-slate-200 text-slate-600",
  draft: "bg-slate-200 text-slate-600",
  // VA applications + client requests
  new: "bg-blue-100 text-blue-800",
  matching: "bg-cyan-100 text-cyan-800",
  matched: "bg-violet-100 text-violet-800",
  closed: "bg-slate-200 text-slate-600",
  applied: "bg-blue-100 text-blue-800",
  screening: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }: { status: string }) {
  return <span className={`badge ${colors[status] ?? "bg-slate-100 text-slate-700"}`}>{titleCase(status)}</span>;
}
