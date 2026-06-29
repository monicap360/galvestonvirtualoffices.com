import Link from "next/link";
import { submitAssistantApplication } from "@/app/virtual-assistants/actions";

export const metadata = { title: "Apply as an Assistant" };

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  if (sent) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white">Application received ✅</h1>
        <p className="mt-3 text-slate-400">
          Thanks for applying! Our team will review your background and reach out about next steps.
        </p>
        <Link href="/" className="btn-primary mt-6">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-3xl font-bold text-white">Apply to be a virtual assistant</h1>
      <p className="mt-3 text-slate-400">
        Join our managed pool of vetted assistants. Tell us about your skills and availability.
      </p>

      <form action={submitAssistantApplication} className="card mt-8 space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" name="name" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required className="input" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="availability">Availability</label>
            <input id="availability" name="availability" className="input" placeholder="e.g. Part-time, 20 hrs/wk" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="skills">Your skills</label>
          <input id="skills" name="skills" required className="input" placeholder="e.g. calendar management, bookkeeping, CRM, social media" />
        </div>
        <div>
          <label className="label" htmlFor="experience">Experience</label>
          <textarea id="experience" name="experience" rows={3} className="input" placeholder="Briefly describe your relevant experience" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="desired_rate">Desired rate ($/hr)</label>
            <input id="desired_rate" name="desired_rate" className="input" placeholder="e.g. $25" />
          </div>
          <div>
            <label className="label" htmlFor="links">Portfolio / LinkedIn / resume URL</label>
            <input id="links" name="links" className="input" placeholder="https://" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="bio">Short bio (optional)</label>
          <textarea id="bio" name="bio" rows={3} className="input" />
        </div>
        <button className="btn-primary w-full">Submit application</button>
        <p className="text-center text-xs text-slate-400">
          Looking to hire instead?{" "}
          <Link href="/virtual-assistants/request" className="font-semibold text-cyan-300 hover:underline">Request an assistant</Link>
        </p>
      </form>
    </div>
  );
}
