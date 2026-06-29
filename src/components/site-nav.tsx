import Link from "next/link";
import { getProfile } from "@/lib/session";

const links = [
  { href: "/virtual-assistants", label: "Virtual Assistants" },
  { href: "/ai-studio", label: "AI Studio" },
  { href: "/mailboxes", label: "Mailboxes" },
  { href: "/offices", label: "Offices" },
  { href: "/services/marketing", label: "AI Marketing" },
  { href: "/services/platforms", label: "Platforms" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default async function SiteNav() {
  const { profile } = await getProfile();
  const isStaff = profile?.role === "admin" || profile?.role === "owner";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5 text-white">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 text-sm font-extrabold tracking-tight text-white ring-1 ring-inset ring-white/25 shadow-[0_0_22px_-4px_rgba(167,139,250,0.85)] transition-transform group-hover:scale-105">
            GV
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-[15px] font-bold tracking-tight">Galveston Virtual Offices</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300/80">Virtual Offices · Mailboxes · AI Support</span>
          </span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-300 transition-colors hover:text-violet-300">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a href="tel:+14094027908" className="hidden text-sm font-semibold text-white hover:text-violet-300 xl:inline-flex">(409) 402-7908</a>
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
