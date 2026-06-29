import Link from "next/link";
import { getTenant } from "@/lib/tenant";
import { LOCATIONS } from "@/lib/locations";

export default async function SiteFooter() {
  const tenant = await getTenant();
  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 text-sm font-extrabold tracking-tight text-white ring-1 ring-inset ring-white/25 shadow-[0_0_18px_-4px_rgba(167,139,250,0.8)]">GV</span>
            <span className="text-lg font-bold tracking-tight text-white">{tenant?.name ?? "Galveston Virtual Offices"}</span>
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-violet-300/80">Virtual Offices · Mailboxes · AI Support</p>
          <p className="mt-2 text-sm text-slate-400">
            The AI-powered business hub — assistants, business address, mailbox & packages, offices, and AI agents across the Houston–Galveston Gulf Coast.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Services</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li><Link href="/virtual-assistants" className="hover:text-violet-300">Managed Virtual Assistants</Link></li>
            <li><Link href="/ai-studio" className="hover:text-violet-300">AI Studio</Link></li>
            <li><Link href="/mailboxes" className="hover:text-violet-300">Virtual Mailboxes</Link></li>
            <li><Link href="/offices" className="hover:text-violet-300">Office Space</Link></li>
            <li><Link href="/services/platforms" className="hover:text-violet-300">Websites & Platforms</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Industries</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li><Link href="/industries/dental" className="hover:text-violet-300">Dental Practices</Link></li>
            <li><Link href="/industries/hair-salons" className="hover:text-violet-300">Hair Salons</Link></li>
            <li><Link href="/industries/home-services" className="hover:text-violet-300">Home Services</Link></li>
            <li><Link href="/industries/med-spas" className="hover:text-violet-300">Med Spas</Link></li>
            <li><Link href="/industries" className="hover:text-violet-300">All industries →</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li><Link href="/blog" className="hover:text-violet-300">Blog</Link></li>
            <li><Link href="/pricing" className="hover:text-violet-300">Pricing</Link></li>
            <li><Link href="/contact" className="hover:text-violet-300">Contact</Link></li>
            <li><Link href="/login" className="hover:text-violet-300">Customer Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Visit / Mail</h4>
          <p className="mt-3 text-sm text-slate-400">{tenant?.mailing_address ?? "3501 Winnie St, Galveston, TX 77550"}</p>
          <a href="tel:+14094027908" className="mt-2 inline-block text-sm font-semibold text-white hover:text-violet-300">
            (409) 402-7908
          </a>
          {tenant?.support_email && (
            <a href={`mailto:${tenant.support_email}`} className="mt-1 block text-sm text-violet-300 hover:underline">
              {tenant.support_email}
            </a>
          )}
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t border-white/5 px-4 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Serving the Houston–Galveston Gulf Coast</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
          {LOCATIONS.map((l) => (
            <Link key={l.slug} href={`/locations/${l.slug}`} className="hover:text-violet-300">{l.city}</Link>
          ))}
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {tenant?.name ?? "Galveston Virtual Offices"}. All rights reserved.
      </div>
    </footer>
  );
}
