"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpAction, type AuthState } from "@/app/auth/actions";

export default function SignupPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUpAction, {});

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-2xl font-bold text-white">Create your account</h1>
      <p className="mt-1 text-sm text-slate-400">Set up your Galveston address, mailbox, and dashboard.</p>

      <form action={action} className="card mt-6 space-y-4 p-6">
        {state.error && (
          <p className="rounded-lg bg-red-400/10 px-3 py-2 text-sm text-red-300">{state.error}</p>
        )}
        {state.message && (
          <p className="rounded-lg bg-violet-400/10 px-3 py-2 text-sm text-violet-300">{state.message}</p>
        )}
        <div>
          <label className="label" htmlFor="full_name">Full name</label>
          <input id="full_name" name="full_name" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone (optional)</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} className="input" />
          <p className="mt-1 text-xs text-slate-400">At least 8 characters.</p>
        </div>
        <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-violet-300 hover:underline">Log in</Link>
      </p>
    </div>
  );
}
