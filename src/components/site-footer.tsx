import Link from "next/link";
import { getTenant } from "@/lib/tenant";

export default async function SiteFooter() {
  const tenant = await getTenant();
  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-950 shadow-[0_0_18px_-4px_rgba(34,211,238,0.7)]">GV</span>
            {tenant?.name ?? "Galveston Virtual Offices"}
          </div>
          <p className="mt-2 text-sm font-semibold text-cyan-300/90">Managed Virtual Assistants &amp; Business Support</p>
          <p className="mt-2 text-sm text-slate-400">
            Dedicated virtual assistants, business address, mailbox, offices, and AI marketing — all on the Gulf Coast.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Services</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li><Link href="/virtual-assistants" className="hover:text-cyan-300">Managed Virtual Assistants</Link></li>
            <li><Link href="/mailboxes" className="hover:text-cyan-300">Virtual Mailboxes</Link></li>
            <li><Link href="/offices" className="hover:text-cyan-300">Office Space</Link></li>
            <li><Link href="/services/marketing" className="hover:text-cyan-300">AI Marketing Assistants</Link></li>
            <li><Link href="/services/platforms" className="hover:text-cyan-300">Websites & Platforms</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li><Link href="/pricing" className="hover:text-cyan-300">Pricing</Link></li>
            <li><Link href="/contact" className="hover:text-cyan-300">Contact</Link></li>
            <li><Link href="/login" className="hover:text-cyan-300">Customer Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Visit / Mail</h4>
          <p className="mt-3 text-sm text-slate-400">{tenant?.mailing_address ?? "Galveston, TX"}</p>
          {tenant?.support_email && (
            <a href={`mailto:${tenant.support_email}`} className="mt-2 inline-block text-sm text-cyan-300 hover:underline">
              {tenant.support_email}
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {tenant?.name ?? "Galveston Virtual Offices"}. All rights reserved.
      </div>
    </footer>
  );
}
