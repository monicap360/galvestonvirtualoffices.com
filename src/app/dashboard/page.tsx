import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/session";
import StatusBadge from "@/components/status-badge";
import { dateLabel, titleCase } from "@/lib/format";

export const metadata = { title: "Dashboard" };

export default async function DashboardHome() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [{ count: unread }, { count: bookings }, { count: openInvoices }, recentMail] = await Promise.all([
    supabase.from("mail_items").select("id", { count: "exact", head: true }).in("status", ["received", "ready_for_pickup"]),
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase.from("invoices").select("id", { count: "exact", head: true }).eq("status", "awaiting_payment"),
    supabase.from("mail_items").select("id, type, sender, status, received_at").order("received_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Mail waiting", value: unread ?? 0, href: "/dashboard/mail" },
    { label: "Bookings", value: bookings ?? 0, href: "/dashboard/bookings" },
    { label: "Invoices to pay", value: openInvoices ?? 0, href: "/dashboard/invoices" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Welcome, {profile.full_name?.split(" ")[0] || "there"}</h1>
      <p className="mt-1 text-slate-600">Here&apos;s what&apos;s happening with your account.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 transition hover:shadow-md">
            <div className="text-3xl font-bold text-slate-900">{s.value}</div>
            <div className="mt-1 text-sm text-slate-600">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="card mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent mail</h2>
          <Link href="/dashboard/mail" className="text-sm font-semibold text-cyan-700 hover:underline">View all →</Link>
        </div>
        {recentMail.data && recentMail.data.length > 0 ? (
          <ul className="mt-4 divide-y divide-slate-100">
            {recentMail.data.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{titleCase(m.type)}{m.sender ? ` · ${m.sender}` : ""}</p>
                  <p className="text-xs text-slate-500">{dateLabel(m.received_at)}</p>
                </div>
                <StatusBadge status={m.status} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No mail yet. We&apos;ll notify you the moment something arrives.</p>
        )}
      </div>
    </div>
  );
}
