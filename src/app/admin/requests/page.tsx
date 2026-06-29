import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/session";
import { updateClientRequest } from "@/app/admin/actions";
import StatusBadge from "@/components/status-badge";
import { dateLabel, money } from "@/lib/format";

export const metadata = { title: "Client Requests" };

const STATUSES = ["new", "matching", "matched", "active", "closed"];

export default async function AdminRequestsPage() {
  const staff = await requireStaff();
  const supabase = await createClient();

  const [{ data: requests }, { data: assistants }] = await Promise.all([
    supabase.from("client_requests").select("*").eq("tenant_id", staff.tenant_id).order("created_at", { ascending: false }),
    supabase.from("assistants").select("id, name, headline, active").eq("tenant_id", staff.tenant_id).eq("active", true).order("name"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Client requests — matching</h1>
      <p className="mt-1 text-slate-400">Review each request and assign the best assistant.</p>

      <div className="mt-6 space-y-4">
        {(requests ?? []).length === 0 && <p className="card p-6 text-sm text-slate-400">No client requests yet.</p>}
        {(requests ?? []).map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-white">
                  {r.business_name ? `${r.business_name} — ` : ""}{r.contact_name}
                </p>
                <p className="text-sm text-slate-400">
                  <a href={`mailto:${r.email}`} className="text-fuchsia-300 hover:underline">{r.email}</a>
                  {r.phone ? ` · ${r.phone}` : ""} · {dateLabel(r.created_at)}
                </p>
              </div>
              <StatusBadge status={r.status} />
            </div>

            <p className="mt-3 text-sm text-slate-300">{r.summary}</p>
            <p className="mt-2 text-xs text-slate-400">
              {r.skills_needed ? `Skills: ${r.skills_needed} · ` : ""}
              {r.hours_per_week ? `${r.hours_per_week} hrs/wk · ` : ""}
              {r.budget_cents ? `budget ${money(r.budget_cents)}/mo` : "budget n/a"}
            </p>

            <form action={updateClientRequest} className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
              <input type="hidden" name="id" value={r.id} />
              <div>
                <label className="label">Assign assistant</label>
                <select name="assigned_assistant_id" defaultValue={r.assigned_assistant_id ?? ""} className="input">
                  <option value="">— Unassigned —</option>
                  {(assistants ?? []).map((a) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.headline})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select name="status" defaultValue={r.status} className="input">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Notes</label>
                <input name="admin_notes" defaultValue={r.admin_notes ?? ""} className="input" placeholder="Internal notes" />
              </div>
              <div className="sm:col-span-3">
                <button className="btn-primary">Save match</button>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
