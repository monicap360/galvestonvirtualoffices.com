import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/session";
import { markInvoicePaid } from "@/app/admin/actions";
import StatusBadge from "@/components/status-badge";
import { dateLabel, money, titleCase } from "@/lib/format";

export const metadata = { title: "Invoices / Checks" };

export default async function AdminInvoicesPage() {
  const staff = await requireStaff();
  const supabase = await createClient();

  const [{ data: invoices }, { data: customers }] = await Promise.all([
    supabase.from("invoices").select("id, reference, description, amount_cents, status, payment_method, created_at, user_id").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, email").eq("tenant_id", staff.tenant_id),
  ]);
  const nameById = new Map((customers ?? []).map((c) => [c.id, c.full_name || c.email]));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Invoices & check payments</h1>
      <p className="mt-1 text-slate-600">When a check arrives, mark its invoice paid — that activates the order automatically.</p>

      <div className="card mt-6 divide-y divide-slate-100">
        {(invoices ?? []).length === 0 && <p className="p-6 text-sm text-slate-500">No invoices yet.</p>}
        {(invoices ?? []).map((inv) => (
          <div key={inv.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium text-slate-900">{inv.description}</p>
              <p className="text-sm text-slate-500">
                {nameById.get(inv.user_id) ?? "—"} · {inv.reference} · {titleCase(inv.payment_method)} · {dateLabel(inv.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-900">{money(inv.amount_cents)}</span>
              <StatusBadge status={inv.status} />
              {inv.status === "awaiting_payment" && (
                <form action={markInvoicePaid}>
                  <input type="hidden" name="id" value={inv.id} />
                  <button className="btn-primary px-3 py-1.5 text-xs">Record check received</button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
