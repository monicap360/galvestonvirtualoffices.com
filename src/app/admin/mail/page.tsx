import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/session";
import { logMail, setMailStatus } from "@/app/admin/actions";
import StatusBadge from "@/components/status-badge";
import { dateLabel, titleCase } from "@/lib/format";

export const metadata = { title: "Log Mail" };

export default async function AdminMailPage() {
  const staff = await requireStaff();
  const supabase = await createClient();

  const [{ data: customers }, { data: mail }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email").eq("tenant_id", staff.tenant_id).order("full_name"),
    supabase.from("mail_items").select("id, type, sender, description, status, received_at, user_id").order("received_at", { ascending: false }).limit(40),
  ]);

  const nameById = new Map((customers ?? []).map((c) => [c.id, c.full_name || c.email]));
  const nextStatus: Record<string, string> = { received: "ready_for_pickup", ready_for_pickup: "picked_up" };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Log incoming mail</h1>

      {/* Log form */}
      <form action={logMail} className="card mt-6 grid gap-4 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="user_id">Customer</label>
          <select id="user_id" name="user_id" required className="input">
            <option value="">Select a customer…</option>
            {(customers ?? []).map((c) => (
              <option key={c.id} value={c.id}>{c.full_name || c.email} ({c.email})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="type">Type</label>
          <select id="type" name="type" className="input">
            <option value="letter">Letter</option>
            <option value="package">Package</option>
            <option value="large_package">Large package</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="sender">Sender</label>
          <input id="sender" name="sender" className="input" placeholder="e.g. IRS, Chase, Amazon" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="description">Notes</label>
          <input id="description" name="description" className="input" placeholder="Optional description" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="photo">Photo (optional)</label>
          <input id="photo" name="photo" type="file" accept="image/*" className="input" />
        </div>
        <div className="sm:col-span-2">
          <button className="btn-primary">Log mail & notify customer</button>
        </div>
      </form>

      {/* Recent mail with quick status updates */}
      <h2 className="mt-10 text-lg font-semibold text-slate-900">Recent mail</h2>
      <div className="card mt-3 divide-y divide-slate-100">
        {(mail ?? []).length === 0 && <p className="p-6 text-sm text-slate-500">No mail logged yet.</p>}
        {(mail ?? []).map((m) => (
          <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium text-slate-900">{nameById.get(m.user_id) ?? "Unknown"}</p>
              <p className="text-sm text-slate-500">
                {titleCase(m.type)}{m.sender ? ` · ${m.sender}` : ""} · {dateLabel(m.received_at)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={m.status} />
              {nextStatus[m.status] && (
                <form action={setMailStatus}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="status" value={nextStatus[m.status]} />
                  <button className="btn-outline px-3 py-1.5 text-xs">
                    Mark {titleCase(nextStatus[m.status])}
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
