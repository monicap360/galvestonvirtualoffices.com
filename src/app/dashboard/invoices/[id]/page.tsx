import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/session";
import StatusBadge from "@/components/status-badge";
import { money, dateLabel } from "@/lib/format";
import { getTenant } from "@/lib/tenant";
import PrintButton from "./print-button";

export const metadata = { title: "Invoice" };

export default async function InvoiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireProfile();
  const { id } = await params;
  const supabase = await createClient();
  const tenant = await getTenant();

  const { data: inv } = await supabase
    .from("invoices")
    .select("id, reference, description, amount_cents, status, payment_method, created_at, paid_at")
    .eq("id", id)
    .maybeSingle();

  if (!inv) notFound();

  const payee = tenant?.name ?? "Galveston Virtual Offices";
  const mailingAddress = tenant?.mailing_address ?? "Galveston Virtual Offices, 3501 Winnie St, Galveston, TX 77550";

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center justify-between gap-3 no-print">
        <Link href="/dashboard/invoices" className="text-sm text-violet-300 hover:underline">← All invoices</Link>
        <PrintButton />
      </div>

      {/* On-screen card (hidden when printing) */}
      <div className="card mt-4 p-6 print-hide">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{inv.description}</h1>
            <p className="mt-1 text-sm text-slate-400">Invoice {inv.reference} · {dateLabel(inv.created_at)}</p>
          </div>
          <StatusBadge status={inv.status} />
        </div>

        <div className="mt-6 rounded-xl bg-white/5 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-slate-400">Amount due</span>
            <span className="text-3xl font-bold text-white">{money(inv.amount_cents)}</span>
          </div>
        </div>

        {inv.status === "paid" ? (
          <p className="mt-6 rounded-lg bg-violet-400/10 px-4 py-3 text-violet-300">
            Paid{inv.paid_at ? ` on ${dateLabel(inv.paid_at)}` : ""}. Thank you!
          </p>
        ) : (
          <div className="mt-6">
            <h2 className="font-semibold text-white">Pay by business check</h2>
            <p className="mt-1 text-sm text-slate-400">
              We accept payment by <strong>business check</strong> only — it verifies your business and keeps every account legitimate.
            </p>
            <ol className="mt-3 space-y-2 text-sm text-slate-300">
              <li>1. Write a <strong>business check</strong> payable to <strong>{payee}</strong> for <strong>{money(inv.amount_cents)}</strong>.</li>
              <li>2. Write reference <strong>{inv.reference}</strong> in the memo line.</li>
              <li>3. Mail it to:</li>
            </ol>
            <div className="mt-3 rounded-lg border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-100">
              {mailingAddress}
            </div>
            <p className="mt-4 text-sm text-slate-400">
              💡 Click <strong>Print / Save PDF</strong> above to print a payment slip and include it with your check.
            </p>
          </div>
        )}
      </div>

      {/* Print-only remittance slip — clean, black-on-white, mail this with the check */}
      <div className="print-only">
        <div className="print-slip">
          <div className="print-head">
            <div>
              <h1>{payee}</h1>
              <p>{mailingAddress}</p>
              <p>(409) 402-7908 · hello@galvestonvirtualoffices.com</p>
            </div>
            <div className="print-title">PAYMENT SLIP</div>
          </div>

          <table className="print-table">
            <tbody>
              <tr><td>Invoice #</td><td>{inv.reference}</td></tr>
              <tr><td>Date</td><td>{dateLabel(inv.created_at)}</td></tr>
              <tr><td>Bill to</td><td>{profile.full_name || profile.email}</td></tr>
              <tr><td>Email</td><td>{profile.email}</td></tr>
              <tr><td>Product / Service</td><td>{inv.description}</td></tr>
              <tr className="print-total"><td>Amount due</td><td>{money(inv.amount_cents)}</td></tr>
            </tbody>
          </table>

          <div className="print-pay">
            <p><strong>Make your business check payable to:</strong> {payee}</p>
            <p><strong>Write in the memo line:</strong> {inv.reference}</p>
            <p><strong>Mail check + this slip to:</strong> {mailingAddress}</p>
          </div>

          <p className="print-note">Please include this slip with your check so we can match your payment and activate your order right away. Thank you!</p>
        </div>
      </div>
    </div>
  );
}
