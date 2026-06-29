"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signInAction, type AuthState } from "@/app/auth/actions";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [state, action, pending] = useActionState<AuthState, FormData>(signInAction, {});

  return (
    <form action={action} className="card mt-6 space-y-4 p-6">
      <input type="hidden" name="next" value={next} />
      {state.error && <p className="rounded-lg bg-red-400/10 px-3 py-2 text-sm text-red-300">{state.error}</p>}
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
        {pending ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-2xl font-bold text-white">Welcome back</h1>
      <p className="mt-1 text-sm text-slate-400">Log in to your dashboard.</p>

      <Suspense fallback={<div className="card mt-6 p-6 text-sm text-slate-400">Loading…</div>}>
        <LoginForm />
      </Suspense>

      <p className="mt-4 text-center text-sm text-slate-400">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-violet-300 hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
