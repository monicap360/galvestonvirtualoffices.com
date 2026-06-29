import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/session";
import StatusBadge from "@/components/status-badge";
import { dateLabel, money } from "@/lib/format";

export const metadata = { title: "Invoices" };

export default async function InvoicesPage() {
  await requireProfile();
  const supabase = await createClient();
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, reference, description, amount_cents, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Invoices</h1>

      {!invoices || invoices.length === 0 ? (
        <div className="card mt-6 p-8 text-center text-slate-400">No invoices yet.</div>
      ) : (
        <div className="card mt-6 divide-y divide-white/10">
          {invoices.map((inv) => (
            <Link key={inv.id} href={`/dashboard/invoices/${inv.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-white/5">
              <div>
                <p className="font-medium text-white">{inv.description}</p>
                <p className="text-sm text-slate-400">{inv.reference} · {dateLabel(inv.created_at)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">{money(inv.amount_cents)}</p>
                <StatusBadge status={inv.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
