"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTenant } from "@/lib/tenant";

export type AuthState = { error?: string; message?: string };

export async function signUpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const tenant = await getTenant();
  if (!tenant) return { error: "We couldn't determine which location you're signing up for." };

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  if (!email || !password || !fullName) return { error: "Name, email, and password are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") || "http"}://${h.get("host")}`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
      data: { tenant_id: tenant.id, full_name: fullName, phone: phone || null },
    },
  });

  if (error) return { error: error.message };
  if (!data.session) return { message: "Almost there — check your email to confirm your account." };

  redirect("/dashboard");
}

export async function signInAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
