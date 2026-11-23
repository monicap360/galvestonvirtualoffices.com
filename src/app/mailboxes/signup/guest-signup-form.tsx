"use client";

import { useActionState } from "react";
import { requestMailboxSignup } from "./actions";

export default function GuestSignupForm({ plan, amount }: { plan: string; amount: number }) {
  const [state, action, pending] = useActionState(requestMailboxSignup, {});
  if (state.reference) return (
    <div role="status" className="card mt-6 space-y-2 p-6">
      <p className="font-semibold text-white">Signup received</p>
      <p className="text-slate-300">Your reference is <strong>{state.reference}</strong>. Our team will follow up with your invoice and next steps.</p>
    </div>
  );
  return (
    <form action={action} className="card mt-6 space-y-4 p-6">
      <input type="hidden" name="plan" value={plan} />
      <input type="hidden" name="amount" value={amount} />
      <div hidden><label htmlFor="website">Leave blank</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      {state.error && <p role="alert" className="text-sm text-amber-300">{state.error}</p>}
      <div><label className="label" htmlFor="name">Full name</label><input className="input" id="name" name="name" autoComplete="name" required maxLength={120} /></div>
      <div><label className="label" htmlFor="email">Contact email</label><input className="input" id="email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
      <div><label className="label" htmlFor="phone">Phone (optional)</label><input className="input" id="phone" name="phone" type="tel" autoComplete="tel" maxLength={40} /></div>
      <button className="btn-primary w-full disabled:opacity-60" disabled={pending}>
        {pending ? "Submitting…" : "Submit guest signup"}
      </button>
    </form>
  );
}
