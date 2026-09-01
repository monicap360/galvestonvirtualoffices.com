import Link from "next/link";
import Image from "next/image";
import { getProfile } from "@/lib/session";
import { getMobileNavigation, publicNavigation } from "@/lib/site-navigation";

export default async function SiteNav() {
  const { profile } = await getProfile();
  const isStaff = profile?.role === "admin" || profile?.role === "owner";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5 text-white">
          <Image
            src="/gvo-logo-mark.png"
            alt="GalvestonVirtualOffices.com desk and chair logo"
            width={44}
            height={44}
            priority
            className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-inset ring-white/20 shadow-[0_0_22px_-4px_rgba(16,185,129,0.6)] transition-transform group-hover:scale-105"
          />
          <span className="hidden leading-tight sm:block">
            <span className="block text-[15px] font-bold tracking-tight">GalvestonVirtualOffices.com</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/80">Virtual Offices · Mailboxes · AI Support</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-emerald-300 [&::-webkit-details-marker]:hidden">
              Services
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true">
                <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className="absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300/70">Services</p>
              {publicNavigation.services.map((link) => (
                <Link key={link.href} href={link.href} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-emerald-400/10 hover:text-emerald-200">
                  {link.label}
                </Link>
              ))}
            </div>
          </details>

          {publicNavigation.primary.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-emerald-300">
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
            <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300/70">Explore</p>
            <div className="grid gap-1 sm:grid-cols-2">
              {getMobileNavigation().map((link) => (
                <Link key={link.href} href={link.href} className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-emerald-400/10 hover:text-emerald-200">
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
