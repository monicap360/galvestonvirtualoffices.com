import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/session";
import StatusBadge from "@/components/status-badge";
import { money, dateLabel } from "@/lib/format";
import { getTenant } from "@/lib/tenant";

export const metadata = { title: "Invoice" };

export default async function InvoiceDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireProfile();
  const { id } = await params;
  const supabase = await createClient();
  const tenant = await getTenant();

  const { data: inv } = await supabase
    .from("invoices")
    .select("id, reference, description, amount_cents, status, payment_method, created_at, paid_at")
    .eq("id", id)
    .maybeSingle();

  if (!inv) notFound();

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/dashboard/invoices" className="text-sm text-cyan-700 hover:underline">← All invoices</Link>

      <div className="card mt-4 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{inv.description}</h1>
            <p className="mt-1 text-sm text-slate-500">Invoice {inv.reference} · {dateLabel(inv.created_at)}</p>
          </div>
          <StatusBadge status={inv.status} />
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-slate-600">Amount due</span>
            <span className="text-3xl font-bold text-slate-900">{money(inv.amount_cents)}</span>
          </div>
        </div>

        {inv.status === "paid" ? (
          <p className="mt-6 rounded-lg bg-emerald-50 px-4 py-3 text-emerald-700">
            Paid{inv.paid_at ? ` on ${dateLabel(inv.paid_at)}` : ""}. Thank you!
          </p>
        ) : (
          <div className="mt-6">
            <h2 className="font-semibold text-slate-900">Pay by business check</h2>
            <p className="mt-1 text-sm text-slate-500">
              We accept payment by <strong>business check</strong> only — it verifies your business and keeps every account legitimate.
            </p>
            <ol className="mt-3 space-y-2 text-sm text-slate-700">
              <li>1. Write a <strong>business check</strong> payable to <strong>{tenant?.name ?? "Galveston Virtual Offices"}</strong> for <strong>{money(inv.amount_cents)}</strong>.</li>
              <li>2. Write reference <strong>{inv.reference}</strong> in the memo line.</li>
              <li>3. Mail it to:</li>
            </ol>
            <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-800">
              {tenant?.mailing_address ?? "Galveston Virtual Offices, Galveston, TX"}
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Your order activates as soon as we receive and record your business check. We&apos;ll email you a confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
