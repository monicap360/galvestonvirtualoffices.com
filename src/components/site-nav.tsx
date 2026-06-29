import Link from "next/link";
import { getProfile } from "@/lib/session";

const links = [
  { href: "/virtual-assistants", label: "Virtual Assistants" },
  { href: "/mailboxes", label: "Mailboxes" },
  { href: "/offices", label: "Offices" },
  { href: "/services/marketing", label: "AI Marketing" },
  { href: "/services/platforms", label: "Websites & Platforms" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default async function SiteNav() {
  const { profile } = await getProfile();
  const isStaff = profile?.role === "admin" || profile?.role === "owner";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 text-slate-900">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan-700 font-bold text-white">GV</span>
          <span className="hidden leading-tight sm:block">
            <span className="block font-bold">Galveston Virtual Offices</span>
            <span className="block text-[11px] font-medium text-cyan-700">Managed Virtual Assistants &amp; Business Support</span>
          </span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-600 hover:text-cyan-700">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {profile ? (
            <>
              {isStaff && (
                <Link href="/admin" className="btn-ghost hidden sm:inline-flex">
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="btn-primary">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
