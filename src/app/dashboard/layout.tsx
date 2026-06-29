import Link from "next/link";
import { requireProfile } from "@/lib/session";
import { signOutAction } from "@/app/auth/actions";

const nav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/mail", label: "Mail" },
  { href: "/dashboard/bookings", label: "Bookings" },
  { href: "/dashboard/mailbox", label: "Mailbox" },
  { href: "/dashboard/orders", label: "Services" },
  { href: "/dashboard/invoices", label: "Invoices" },
  { href: "/dashboard/profile", label: "Profile" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();
  const isStaff = profile.role === "admin" || profile.role === "owner";

  return (
    <div className="mx-auto max-w-6xl gap-8 px-4 py-8 lg:flex">
      <aside className="lg:w-56 lg:shrink-0">
        <div className="card p-4">
          <p className="text-xs text-slate-500">Signed in as</p>
          <p className="truncate font-semibold text-slate-900">{profile.full_name || profile.email}</p>
          <nav className="mt-4 flex flex-row flex-wrap gap-1 lg:flex-col">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                {n.label}
              </Link>
            ))}
            {isStaff && (
              <Link href="/admin" className="rounded-lg px-3 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50">
                Admin →
              </Link>
            )}
          </nav>
          <form action={signOutAction} className="mt-4 border-t border-slate-100 pt-4">
            <button className="text-sm text-slate-500 hover:text-red-600">Sign out</button>
          </form>
        </div>
      </aside>
      <section className="mt-6 flex-1 lg:mt-0">{children}</section>
    </div>
  );
}
