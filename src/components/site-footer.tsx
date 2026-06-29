import Link from "next/link";
import { getTenant } from "@/lib/tenant";
import { LOCATIONS } from "@/lib/locations";

export default async function SiteFooter() {
  const tenant = await getTenant();
  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-fuchsia-400 to-violet-500 text-slate-950 shadow-[0_0_18px_-4px_rgba(232,121,249,0.7)]">GV</span>
            {tenant?.name ?? "Galveston Virtual Offices"}
          </div>
          <p className="mt-2 text-sm font-semibold text-fuchsia-300/90">Business Support Built for Women</p>
          <p className="mt-2 text-sm text-slate-400">
            The AI-powered business hub for women entrepreneurs — assistants, address, mailbox, offices, and AI agents on the Gulf Coast.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Services</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li><Link href="/virtual-assistants" className="hover:text-fuchsia-300">Managed Virtual Assistants</Link></li>
            <li><Link href="/ai-studio" className="hover:text-fuchsia-300">AI Studio</Link></li>
            <li><Link href="/mailboxes" className="hover:text-fuchsia-300">Virtual Mailboxes</Link></li>
            <li><Link href="/offices" className="hover:text-fuchsia-300">Office Space</Link></li>
            <li><Link href="/services/platforms" className="hover:text-fuchsia-300">Websites & Platforms</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Industries</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li><Link href="/industries/dental" className="hover:text-fuchsia-300">Dental Practices</Link></li>
            <li><Link href="/industries/hair-salons" className="hover:text-fuchsia-300">Hair Salons</Link></li>
            <li><Link href="/industries/home-services" className="hover:text-fuchsia-300">Home Services</Link></li>
            <li><Link href="/industries/med-spas" className="hover:text-fuchsia-300">Med Spas</Link></li>
            <li><Link href="/industries" className="hover:text-fuchsia-300">All industries →</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li><Link href="/pricing" className="hover:text-fuchsia-300">Pricing</Link></li>
            <li><Link href="/contact" className="hover:text-fuchsia-300">Contact</Link></li>
            <li><Link href="/login" className="hover:text-fuchsia-300">Customer Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Visit / Mail</h4>
          <p className="mt-3 text-sm text-slate-400">{tenant?.mailing_address ?? "Galveston, TX"}</p>
          {tenant?.support_email && (
            <a href={`mailto:${tenant.support_email}`} className="mt-2 inline-block text-sm text-fuchsia-300 hover:underline">
              {tenant.support_email}
            </a>
          )}
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t border-white/5 px-4 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Serving the Houston–Galveston Gulf Coast</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
          {LOCATIONS.map((l) => (
            <Link key={l.slug} href={`/locations/${l.slug}`} className="hover:text-fuchsia-300">{l.city}</Link>
          ))}
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {tenant?.name ?? "Galveston Virtual Offices"}. All rights reserved.
      </div>
    </footer>
  );
}
