import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/session";
import StatusBadge from "@/components/status-badge";
import { dateLabel, money } from "@/lib/format";

export const metadata = { title: "Services" };

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  await requireProfile();
  const { submitted } = await searchParams;
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("service_orders")
    .select("id, status, quoted_price_cents, created_at, services(name, category)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Your services</h1>
        <Link href="/services/marketing" className="btn-outline">Browse services</Link>
      </div>

      {submitted && (
        <p className="mt-4 rounded-lg bg-violet-400/10 px-4 py-3 text-sm text-violet-300">
          Request received — we&apos;ll review and send your quote shortly.
        </p>
      )}

      {!orders || orders.length === 0 ? (
        <div className="card mt-6 p-8 text-center text-slate-400">No services yet.</div>
      ) : (
        <div className="card mt-6 divide-y divide-white/10">
          {orders.map((o) => {
            const svc = o.services as unknown as { name: string; category: string } | null;
            return (
              <div key={o.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium text-white">{svc?.name ?? "Service"}</p>
                  <p className="text-sm text-slate-400">Started {dateLabel(o.created_at)}</p>
                </div>
                <div className="text-right">
                  {o.quoted_price_cents != null && (
                    <p className="font-semibold text-white">{money(o.quoted_price_cents)}</p>
                  )}
                  <StatusBadge status={o.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
