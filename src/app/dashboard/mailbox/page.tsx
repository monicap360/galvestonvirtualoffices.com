import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/session";
import StatusBadge from "@/components/status-badge";
import { dateLabel, money } from "@/lib/format";
import { getTenant } from "@/lib/tenant";

export const metadata = { title: "Mailbox" };

export default async function MailboxPage() {
  await requireProfile();
  const supabase = await createClient();
  const tenant = await getTenant();

  const { data: subs } = await supabase
    .from("mailbox_subscriptions")
    .select("id, mailbox_number, status, started_at, created_at, mailbox_plans(name, price_cents, interval)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Your mailbox</h1>
        <Link href="/mailboxes" className="btn-outline">Change plan</Link>
      </div>

      {!subs || subs.length === 0 ? (
        <div className="card mt-6 p-8 text-center">
          <p className="text-slate-500">You don&apos;t have a mailbox yet.</p>
          <Link href="/mailboxes" className="btn-primary mt-4">Get a virtual mailbox</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {subs.map((s) => {
            const plan = s.mailbox_plans as unknown as { name: string; price_cents: number; interval: string } | null;
            return (
              <div key={s.id} className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Mailbox number</p>
                    <p className="text-xl font-bold text-slate-900">{s.mailbox_number}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
                {tenant?.mailing_address && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                    <p className="font-medium text-slate-900">Your mailing address</p>
                    <p>{tenant.mailing_address} — {s.mailbox_number}</p>
                  </div>
                )}
                <p className="mt-4 text-sm text-slate-600">
                  Plan: <strong>{plan?.name}</strong> · {plan ? `${money(plan.price_cents)}/${plan.interval}` : ""}
                  {s.started_at ? ` · since ${dateLabel(s.started_at)}` : ""}
                </p>
                {s.status === "pending" && (
                  <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                    Pending payment & USPS Form 1583. Activates once your first payment is received.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
