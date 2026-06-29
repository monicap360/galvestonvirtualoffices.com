import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: "customer" | "admin" | "owner";
};

// Current auth user + their profile (or nulls when signed out).
export async function getProfile(): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, tenant_id, email, full_name, phone, role")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile: (profile as Profile) ?? null };
}

// Require a logged-in customer; redirect to login otherwise.
export async function requireProfile(next = "/dashboard"): Promise<Profile> {
  const { profile } = await getProfile();
  if (!profile) redirect(`/login?next=${encodeURIComponent(next)}`);
  return profile;
}

// Require admin/owner; redirect non-staff away.
export async function requireStaff(): Promise<Profile> {
  const profile = await requireProfile("/admin");
  if (profile.role !== "admin" && profile.role !== "owner") redirect("/dashboard");
  return profile;
}
