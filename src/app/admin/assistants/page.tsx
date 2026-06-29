import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/session";
import { approveApplication, setApplicationStatus, setAssistantActive } from "@/app/admin/actions";
import StatusBadge from "@/components/status-badge";
import { dateLabel, money } from "@/lib/format";

export const metadata = { title: "Assistants" };

export default async function AdminAssistantsPage() {
  const staff = await requireStaff();
  const supabase = await createClient();

  const [{ data: applications }, { data: roster }] = await Promise.all([
    supabase.from("assistant_applications").select("*").eq("tenant_id", staff.tenant_id).order("created_at", { ascending: false }),
    supabase.from("assistants").select("*").eq("tenant_id", staff.tenant_id).order("created_at", { ascending: false }),
  ]);

  const pending = (applications ?? []).filter((a) => a.status === "applied" || a.status === "screening");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white">Assistant applications</h1>
        <p className="mt-1 text-slate-400">Review applicants and approve them onto the roster.</p>

        <div className="mt-5 space-y-4">
          {pending.length === 0 && <p className="card p-6 text-sm text-slate-400">No applications waiting.</p>}
          {pending.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-white">{a.name}</p>
                  <p className="text-sm text-slate-400">
                    <a href={`mailto:${a.email}`} className="text-cyan-300 hover:underline">{a.email}</a>
                    {a.phone ? ` · ${a.phone}` : ""} · {dateLabel(a.created_at)}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>
              <p className="mt-2 text-sm text-slate-300"><strong>Skills:</strong> {a.skills}</p>
              {a.experience && <p className="mt-1 text-sm text-slate-400">{a.experience}</p>}
              <p className="mt-1 text-xs text-slate-400">
                {a.availability ? `${a.availability} · ` : ""}
                {a.desired_rate_cents ? `${money(a.desired_rate_cents)}/hr desired` : "rate n/a"}
                {a.links ? ` · ${a.links}` : ""}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <form action={approveApplication}>
                  <input type="hidden" name="id" value={a.id} />
                  <button className="btn-primary px-3 py-1.5 text-xs">Approve → add to roster</button>
                </form>
                {a.status !== "screening" && (
                  <form action={setApplicationStatus}>
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="status" value="screening" />
                    <button className="btn-outline px-3 py-1.5 text-xs">Move to screening</button>
                  </form>
                )}
                <form action={setApplicationStatus}>
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="status" value="rejected" />
                  <button className="btn-ghost px-3 py-1.5 text-xs text-red-600">Reject</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white">Active roster</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(roster ?? []).length === 0 && <p className="card p-6 text-sm text-slate-400">No assistants on the roster yet.</p>}
          {(roster ?? []).map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">{a.name}</p>
                <span className={`badge ${a.active ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-slate-300"}`}>
                  {a.active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-cyan-300">{a.headline}</p>
              <p className="mt-1 text-xs text-slate-400">{money(a.hourly_rate_cents)}/hr · {a.availability ?? "—"}</p>
              <form action={setAssistantActive} className="mt-3">
                <input type="hidden" name="id" value={a.id} />
                <input type="hidden" name="active" value={(!a.active).toString()} />
                <button className="btn-outline px-3 py-1.5 text-xs">{a.active ? "Deactivate" : "Reactivate"}</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
