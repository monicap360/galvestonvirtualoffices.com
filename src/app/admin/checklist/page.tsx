import { requireStaff } from "@/lib/session";
import Checklist, { type Section } from "./checklist";

export const metadata = { title: "Launch Checklist" };

const SUPA = "https://supabase.com/dashboard/project/pljqnaxowvhkzyeybqal";

const SECTIONS: Section[] = [
  {
    title: "Go live & setup",
    items: [
      { id: "deploy", label: "Site deployed & live on Render", detail: "galvestonvirtualoffices.com is up.", defaultDone: true },
      { id: "run-sql", label: "Run remaining SQL in Supabase", detail: "AI Studio products + office catalog fix + address update.", href: `${SUPA}/sql/new`, hrefLabel: "Open SQL editor" },
      { id: "auth-url", label: "Set Supabase Auth Site URL to the production domain", detail: "So signup/login emails point to galvestonvirtualoffices.com.", href: `${SUPA}/auth/url-configuration`, hrefLabel: "Open auth settings" },
      { id: "make-owner", label: "Make your account an owner/admin", detail: "Sign up, then run: update public.profiles set role='owner' where email='you@example.com';" },
      { id: "reset-pw", label: "Reset both database passwords", detail: "They were shared during setup — rotate them for security.", href: `${SUPA}/settings/database`, hrefLabel: "Reset password" },
    ],
  },
  {
    title: "Search engine SEO",
    items: [
      { id: "gsc-verify", label: "Verify your site in Google Search Console", href: "https://search.google.com/search-console", hrefLabel: "Search Console" },
      { id: "submit-sitemap", label: "Submit sitemap.xml to Google Search Console", detail: "Done — Google discovered 36 pages.", defaultDone: true },
      { id: "request-index", label: "Request indexing for key pages", detail: "Home, /locations/houston, /locations/galveston, /services/marketing, /mailboxes." },
      { id: "bing", label: "Submit sitemap to Bing Webmaster Tools", detail: "Covers Bing + DuckDuckGo.", href: "https://www.bing.com/webmasters", hrefLabel: "Bing Webmaster" },
    ],
  },
  {
    title: "Local presence & reviews",
    items: [
      { id: "gbp-claim", label: "Claim & verify your Google Business Profile", detail: "Done — claimed & verified.", defaultDone: true, href: "https://business.google.com", hrefLabel: "Google Business" },
      { id: "gbp-posts", label: "Add photos & posts to your Google Business Profile", detail: "Show your portside location; post regularly — active profiles rank higher." },
      { id: "reviews", label: "Collect Google reviews", detail: "Ask every happy client. Aim for 15–20 to start — your AI Review Manager automates this." },
      { id: "citations", label: "List your NAP on Yelp, Bing Places, Apple Maps & local chambers", detail: "Use exactly: Galveston Virtual Offices · 3501 Winnie St, Galveston, TX 77550 · (409) 402-7908." },
    ],
  },
  {
    title: "Content & polish",
    items: [
      { id: "phone", label: "Real phone number added site-wide", detail: "(409) 402-7908 is live in the nav, footer, schema & CTAs.", defaultDone: true },
      { id: "testimonials", label: "Replace sample testimonials with real client quotes", detail: "Send me 3 real quotes (name + role) and I'll add them." },
      { id: "review-button", label: "Add a “Leave us a review” button", detail: "Make collecting Google reviews effortless." },
      { id: "blog", label: "Publish more blog posts & city pages over time", detail: "Each one targets new long-tail local searches and compounds your SEO." },
    ],
  },
];

export default async function ChecklistPage() {
  await requireStaff();
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Launch &amp; growth checklist</h1>
      <p className="mt-1 text-slate-400">Your step-by-step plan to a fully live, ranking business. Progress saves in this browser.</p>
      <div className="mt-6">
        <Checklist sections={SECTIONS} />
      </div>
    </div>
  );
}
