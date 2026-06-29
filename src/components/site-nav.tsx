import Link from "next/link";
import { getProfile } from "@/lib/session";

const links = [
  { href: "/virtual-assistants", label: "Virtual Assistants" },
  { href: "/ai-assistant", label: "AI Assistant" },
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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 font-bold text-slate-950 shadow-[0_0_20px_-4px_rgba(34,211,238,0.7)]">
            GV
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block font-bold">Galveston Virtual Offices</span>
            <span className="block text-[11px] font-medium text-cyan-300/90">Managed Virtual Assistants &amp; Business Support</span>
          </span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-300 transition-colors hover:text-cyan-300">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/contact" className="btn-outline hidden md:inline-flex">Book a call</Link>
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
