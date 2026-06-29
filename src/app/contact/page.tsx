import { submitContact } from "@/app/orders/actions";
import { getTenant } from "@/lib/tenant";

export const metadata = { title: "Contact" };

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;
  const tenant = await getTenant();

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-3xl font-bold text-slate-900">Get in touch</h1>
      <p className="mt-3 text-slate-600">
        Questions about a mailbox, office, or a custom platform? Send us a note and we&apos;ll reply quickly.
      </p>
      {tenant?.mailing_address && (
        <p className="mt-2 text-sm text-slate-500">{tenant.mailing_address}</p>
      )}

      {sent ? (
        <div className="card mt-8 p-6">
          <p className="text-emerald-700">Thanks! Your message has been received — we&apos;ll be in touch shortly.</p>
        </div>
      ) : (
        <form action={submitContact} className="card mt-8 space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">Name</label>
              <input id="name" name="name" required className="input" />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required className="input" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="phone">Phone (optional)</label>
              <input id="phone" name="phone" type="tel" className="input" />
            </div>
            <div>
              <label className="label" htmlFor="subject">Subject</label>
              <input id="subject" name="subject" className="input" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} required className="input" />
          </div>
          <button className="btn-primary">Send message</button>
        </form>
      )}
    </div>
  );
}
