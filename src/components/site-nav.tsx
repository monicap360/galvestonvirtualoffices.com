import Link from "next/link";
import { getProfile } from "@/lib/session";
import { getMobileNavigation, publicNavigation } from "@/lib/site-navigation";

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

        <div className="hidden items-center gap-1 lg:flex">
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-violet-300 [&::-webkit-details-marker]:hidden">
              Services
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true">
                <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className="absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300/70">Services</p>
              {publicNavigation.services.map((link) => (
                <Link key={link.href} href={link.href} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-violet-400/10 hover:text-violet-200">
                  {link.label}
                </Link>
              ))}
            </div>
          </details>

          {publicNavigation.primary.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-violet-300">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
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

        <details className="group relative lg:hidden">
          <summary className="btn-outline flex cursor-pointer list-none items-center gap-2 [&::-webkit-details-marker]:hidden" aria-label="Open navigation menu">
            Menu
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true">
              <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <div className="absolute right-0 top-full mt-3 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300/70">Explore</p>
            <div className="grid gap-1 sm:grid-cols-2">
              {getMobileNavigation().map((link) => (
                <Link key={link.href} href={link.href} className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-violet-400/10 hover:text-violet-200">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-3 grid gap-2 border-t border-white/10 pt-3 sm:grid-cols-2">
              <a href="tel:+14094027908" className="btn-outline justify-center">(409) 402-7908</a>
              <Link href="/contact" className="btn-outline justify-center">Book a call</Link>
              {profile ? (
                <>
                  {isStaff && <Link href="/admin" className="btn-ghost justify-center">Admin</Link>}
                  <Link href="/dashboard" className="btn-primary justify-center">Dashboard</Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost justify-center">Log in</Link>
                  <Link href="/signup" className="btn-primary justify-center">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
