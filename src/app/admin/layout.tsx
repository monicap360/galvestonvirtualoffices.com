import Link from "next/link";
import { requireStaff } from "@/lib/session";
import { signOutAction } from "@/app/auth/actions";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/requests", label: "Client Requests" },
  { href: "/admin/assistants", label: "Assistants" },
  { href: "/admin/mail", label: "Log Mail" },
  { href: "/admin/invoices", label: "Invoices / Checks" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/orders", label: "Service Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/messages", label: "Messages" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();

  return (
    <div className="mx-auto max-w-6xl gap-8 px-4 py-8 lg:flex">
      <aside className="lg:w-56 lg:shrink-0">
        <div className="card p-4">
          <span className="badge bg-gradient-to-br from-indigo-400 to-violet-500 text-slate-950">Admin</span>
          <p className="mt-2 truncate text-sm font-semibold text-white">{staff.full_name || staff.email}</p>
          <nav className="mt-4 flex flex-row flex-wrap gap-1 lg:flex-col">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10">
                {n.label}
              </Link>
            ))}
            <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm font-semibold text-violet-300 hover:bg-violet-400/10">
              ← Customer view
            </Link>
          </nav>
          <form action={signOutAction} className="mt-4 border-t border-white/10 pt-4">
            <button className="text-sm text-slate-400 hover:text-red-600">Sign out</button>
          </form>
        </div>
      </aside>
      <section className="mt-6 flex-1 lg:mt-0">{children}</section>
    </div>
  );
}
