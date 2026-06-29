import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/session";

export const metadata = { title: "Admin" };

export default async function AdminHome() {
  await requireStaff();
  const supabase = await createClient();

  const [requests, applications, checks, mail, bookings, messages] = await Promise.all([
    supabase.from("client_requests").select("id", { count: "exact", head: true }).in("status", ["new", "matching"]),
    supabase.from("assistant_applications").select("id", { count: "exact", head: true }).in("status", ["applied", "screening"]),
    supabase.from("invoices").select("id", { count: "exact", head: true }).eq("status", "awaiting_payment"),
    supabase.from("mail_items").select("id", { count: "exact", head: true }).in("status", ["received", "ready_for_pickup"]),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("handled", false),
  ]);

  const cards = [
    { label: "Requests to match", value: requests.count ?? 0, href: "/admin/requests" },
    { label: "Applications to review", value: applications.count ?? 0, href: "/admin/assistants" },
    { label: "Checks awaiting payment", value: checks.count ?? 0, href: "/admin/invoices" },
    { label: "Mail to hand out", value: mail.count ?? 0, href: "/admin/mail" },
    { label: "Pending bookings", value: bookings.count ?? 0, href: "/admin/bookings" },
    { label: "New messages", value: messages.count ?? 0, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Back office</h1>
      <p className="mt-1 text-slate-600">Run the day-to-day: log mail, record checks, and manage orders.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card p-5 transition hover:shadow-md">
            <div className="text-3xl font-bold text-slate-900">{c.value}</div>
            <div className="mt-1 text-sm text-slate-600">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
