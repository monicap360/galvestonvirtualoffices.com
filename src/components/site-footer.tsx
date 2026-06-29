import Link from "next/link";
import { getTenant } from "@/lib/tenant";

export default async function SiteFooter() {
  const tenant = await getTenant();
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-700 text-white">GV</span>
            {tenant?.name ?? "Galveston Virtual Offices"}
          </div>
          <p className="mt-2 text-sm font-semibold text-cyan-700">Managed Virtual Assistants &amp; Business Support</p>
          <p className="mt-2 text-sm text-slate-500">
            Dedicated virtual assistants, business address, mailbox, offices, and AI marketing — all on the Gulf Coast.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Services</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/virtual-assistants" className="hover:text-cyan-700">Managed Virtual Assistants</Link></li>
            <li><Link href="/mailboxes" className="hover:text-cyan-700">Virtual Mailboxes</Link></li>
            <li><Link href="/offices" className="hover:text-cyan-700">Office Space</Link></li>
            <li><Link href="/services/marketing" className="hover:text-cyan-700">AI Marketing Assistants</Link></li>
            <li><Link href="/services/platforms" className="hover:text-cyan-700">Websites & Platforms</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/pricing" className="hover:text-cyan-700">Pricing</Link></li>
            <li><Link href="/contact" className="hover:text-cyan-700">Contact</Link></li>
            <li><Link href="/login" className="hover:text-cyan-700">Customer Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Visit / Mail</h4>
          <p className="mt-3 text-sm text-slate-600">{tenant?.mailing_address ?? "Galveston, TX"}</p>
          {tenant?.support_email && (
            <a href={`mailto:${tenant.support_email}`} className="mt-2 inline-block text-sm text-cyan-700 hover:underline">
              {tenant.support_email}
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {tenant?.name ?? "Galveston Virtual Offices"}. All rights reserved.
      </div>
    </footer>
  );
}
