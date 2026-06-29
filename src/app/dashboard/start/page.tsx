import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/session";
import { getTenant } from "@/lib/tenant";
import PrintButton from "./print-button";

export const metadata = { title: "Get Started" };

const FORM_1583_URL = "https://about.usps.com/forms/ps1583.pdf";

export default async function StartPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const tenant = await getTenant();

  const { data: sub } = await supabase
    .from("mailbox_subscriptions")
    .select("mailbox_number, status, mailbox_plans(name)")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const payee = tenant?.name ?? "Galveston Virtual Offices";
  const mailing = tenant?.mailing_address ?? "Galveston Virtual Offices, 3501 Winnie St, Galveston, TX 77550";
  const mailboxNumber = sub?.mailbox_number ?? null;
  const yourAddress = mailboxNumber ? `${mailing} — ${mailboxNumber}` : mailing;

  const steps = [
    { t: "Complete USPS Form 1583", d: "This authorizes us to receive mail and packages on your behalf. Download, print, and fill it out." },
    { t: "Get Form 1583 notarized", d: "In person at any notary, or via an online notary. Bring two forms of valid ID (one photo)." },
    { t: "Mail the form + your business check", d: `Send the notarized Form 1583 and your business check to ${mailing}.` },
    { t: "We activate your mailbox", d: "Once we receive and verify everything, your mailbox goes live and we start accepting your mail and packages." },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      {/* On-screen view (hidden when printing) */}
      <div className="print-hide">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, {profile.full_name?.split(" ")[0] || "there"} 🎉</h1>
            <p className="mt-1 text-slate-400">Let&apos;s get your Galveston mailbox set up. Print this packet to mail with your form &amp; check.</p>
          </div>
          <PrintButton />
        </div>

        <div className="card mt-6 border-violet-400/20 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-300/80">Your Galveston address</p>
          <p className="mt-1 text-lg font-semibold text-white">{yourAddress}</p>
          {mailboxNumber ? (
            <p className="mt-1 text-sm text-slate-400">Mailbox {mailboxNumber} · {sub?.status === "active" ? "Active" : "Pending setup"}</p>
          ) : (
            <p className="mt-2 text-sm text-slate-400">
              No mailbox yet? <Link href="/mailboxes" className="font-semibold text-violet-300 hover:underline">Choose a plan →</Link>
            </p>
          )}
        </div>

        <div className="card mt-6 p-6">
          <h2 className="font-semibold text-white">How to finish setup</h2>
          <ol className="mt-4 space-y-4">
            {steps.map((s, i) => (
              <li key={s.t} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 text-sm font-bold text-white">{i + 1}</span>
                <div>
                  <p className="font-medium text-white">{s.t}</p>
                  <p className="text-sm text-slate-400">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <a href={FORM_1583_URL} target="_blank" rel="noopener noreferrer" className="btn-outline mt-5 inline-flex">⬇ Download USPS Form 1583</a>
        </div>
      </div>

      {/* Print-only packet — print this and mail it with your Form 1583 + check */}
      <div className="print-only">
        <div className="print-slip">
          <div className="print-head">
            <div>
              <h1>{payee}</h1>
              <p>{mailing}</p>
              <p>(409) 402-7908 · hello@galvestonvirtualoffices.com</p>
            </div>
            <div className="print-title">MAILBOX SETUP</div>
          </div>

          <table className="print-table">
            <tbody>
              <tr><td>Customer</td><td>{profile.full_name || profile.email}</td></tr>
              <tr><td>Email</td><td>{profile.email}</td></tr>
              {mailboxNumber && <tr><td>Mailbox #</td><td>{mailboxNumber}</td></tr>}
              <tr><td>Your address</td><td>{yourAddress}</td></tr>
            </tbody>
          </table>

          <div className="print-pay">
            <p style={{ fontWeight: 700, marginBottom: "6px" }}>Mailbox setup checklist — include with your mailing:</p>
            <p>☐ 1. Completed &amp; notarized USPS Form 1583 (download: about.usps.com/forms/ps1583.pdf)</p>
            <p>☐ 2. Two forms of valid ID copies (one photo ID)</p>
            <p>☐ 3. Your business check for the first month</p>
            <p style={{ marginTop: "10px" }}><strong>Mail everything to:</strong> {mailing}</p>
          </div>

          <p className="print-note">Once we receive and verify your Form 1583, ID, and check, we activate your mailbox and begin accepting your mail and packages. Questions? Call (409) 402-7908.</p>
        </div>
      </div>
    </div>
  );
}
