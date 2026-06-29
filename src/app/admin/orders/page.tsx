import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/session";
import { updateServiceOrder } from "@/app/admin/actions";
import StatusBadge from "@/components/status-badge";
import { dateLabel, money } from "@/lib/format";

export const metadata = { title: "Service Orders" };

const STATUSES = ["inquiry", "quoted", "in_progress", "active", "completed", "cancelled"];

export default async function AdminOrdersPage() {
  const staff = await requireStaff();
  const supabase = await createClient();

  const [{ data: orders }, { data: customers }] = await Promise.all([
    supabase.from("service_orders").select("id, status, config, quoted_price_cents, created_at, user_id, services(name, category)").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, email").eq("tenant_id", staff.tenant_id),
  ]);
  const nameById = new Map((customers ?? []).map((c) => [c.id, c.full_name || c.email]));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Service orders</h1>
      <p className="mt-1 text-slate-600">Quote web/platform builds and track marketing engagements.</p>

      <div className="mt-6 space-y-4">
        {(orders ?? []).length === 0 && <p className="card p-6 text-sm text-slate-500">No service orders yet.</p>}
        {(orders ?? []).map((o) => {
          const svc = o.services as unknown as { name: string; category: string } | null;
          const config = (o.config ?? {}) as Record<string, string>;
          return (
            <div key={o.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">{svc?.name ?? "Service"} — {nameById.get(o.user_id) ?? "—"}</p>
                  <p className="text-sm text-slate-500">{dateLabel(o.created_at)}{o.quoted_price_cents != null ? ` · quoted ${money(o.quoted_price_cents)}` : ""}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>

              {Object.keys(config).length > 0 && (
                <dl className="mt-3 grid gap-1 rounded-lg bg-slate-50 p-3 text-sm sm:grid-cols-2">
                  {Object.entries(config).map(([k, v]) => (
                    <div key={k}><dt className="inline text-slate-500">{k.replace(/_/g, " ")}: </dt><dd className="inline text-slate-800">{v}</dd></div>
                  ))}
                </dl>
              )}

              <form action={updateServiceOrder} className="mt-4 flex flex-wrap items-end gap-3">
                <input type="hidden" name="id" value={o.id} />
                <div>
                  <label className="label">Status</label>
                  <select name="status" defaultValue={o.status} className="input w-44">
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Quote ($)</label>
                  <input name="quoted_price" type="number" step="0.01" placeholder="e.g. 7500" className="input w-36" />
                </div>
                <button className="btn-primary">Update</button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
