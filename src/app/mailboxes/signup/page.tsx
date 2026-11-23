import Link from "next/link";
import { getMailboxPlans } from "@/lib/catalog";
import { price } from "@/lib/format";
import GuestSignupForm from "./guest-signup-form";

export const metadata = { title: "Guest mailbox signup" };

export default async function GuestMailboxSignupPage({ searchParams }: PageProps<"/mailboxes/signup">) {
  const [plans, { plan: planId }] = await Promise.all([getMailboxPlans(), searchParams]);
  const plan = plans.find((entry) => entry.id === planId);
  return (
    <main className="mx-auto max-w-xl px-4 py-14">
      <Link href="/mailboxes" className="text-violet-300 hover:underline">Back to mailbox plans</Link>
      {plan ? (
        <>
          <h1 className="mt-4 text-3xl font-bold text-white">Sign up for {plan.name}</h1>
          <p className="mt-2 text-lg font-semibold text-violet-300">{price(plan.price_cents, plan.interval)}</p>
          <p className="mt-3 text-slate-300">We’ll use your email to follow up with your first invoice and mailbox setup instructions. Your signup stays pending while our team reviews it.</p>
          <GuestSignupForm plan={plan.id} amount={plan.price_cents} />
        </>
      ) : (
        <>
          <h1 className="mt-4 text-3xl font-bold text-white">Choose a mailbox plan</h1>
          <p className="mt-3 text-slate-300">Select a currently available plan before starting guest signup.</p>
        </>
      )}
    </main>
  );
}
