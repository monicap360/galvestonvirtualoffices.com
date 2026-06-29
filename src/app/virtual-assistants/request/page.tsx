import Link from "next/link";
import { submitClientRequest } from "@/app/virtual-assistants/actions";

export const metadata = { title: "Request an Assistant" };

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  if (sent) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white">Request received 🎉</h1>
        <p className="mt-3 text-slate-400">
          Thanks! Our team will review your needs and match you with the right assistant. We&apos;ll be in touch by email shortly.
        </p>
        <Link href="/" className="btn-primary mt-6">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-3xl font-bold text-white">Request a virtual assistant</h1>
      <p className="mt-3 text-slate-400">
        Tell us about your business and what you need help with. We&apos;ll match you with a vetted, managed assistant.
      </p>

      <form action={submitClientRequest} className="card mt-8 space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="contact_name">Your name</label>
            <input id="contact_name" name="contact_name" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="business_name">Business name</label>
            <input id="business_name" name="business_name" className="input" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" className="input" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="summary">What do you need help with?</label>
          <textarea id="summary" name="summary" rows={4} required className="input" placeholder="e.g. inbox & calendar management, customer follow-up, bookkeeping…" />
        </div>
        <div>
          <label className="label" htmlFor="skills_needed">Key skills needed (optional)</label>
          <input id="skills_needed" name="skills_needed" className="input" placeholder="e.g. QuickBooks, CRM, social media" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="hours_per_week">Hours per week</label>
            <input id="hours_per_week" name="hours_per_week" type="number" min="1" className="input" placeholder="e.g. 20" />
          </div>
          <div>
            <label className="label" htmlFor="budget">Monthly budget (optional)</label>
            <input id="budget" name="budget" className="input" placeholder="e.g. $800" />
          </div>
        </div>
        <button className="btn-primary w-full">Submit request</button>
        <p className="text-center text-xs text-slate-400">
          Want to join our team instead?{" "}
          <Link href="/virtual-assistants/apply" className="font-semibold text-violet-300 hover:underline">Apply as an assistant</Link>
        </p>
      </form>
    </div>
  );
}
