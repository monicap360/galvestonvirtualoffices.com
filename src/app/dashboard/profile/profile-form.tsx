"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "./actions";

export default function ProfileForm({
  fullName,
  phone,
  email,
}: {
  fullName: string;
  phone: string;
  email: string;
}) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfile, {});

  return (
    <form action={action} className="card mt-6 space-y-4 p-6">
      {state.error && <p className="rounded-lg bg-red-400/10 px-3 py-2 text-sm text-red-300">{state.error}</p>}
      {state.message && <p className="rounded-lg bg-fuchsia-400/10 px-3 py-2 text-sm text-fuchsia-300">{state.message}</p>}
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" value={email} disabled className="input bg-white/5 text-slate-400" />
      </div>
      <div>
        <label className="label" htmlFor="full_name">Full name</label>
        <input id="full_name" name="full_name" defaultValue={fullName} required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="tel" defaultValue={phone} className="input" />
      </div>
      <button disabled={pending} className="btn-primary disabled:opacity-60">
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
