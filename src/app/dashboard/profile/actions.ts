"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/session";

export type ProfileState = { message?: string; error?: string };

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const profile = await requireProfile();
  const full_name = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim() || null;
  if (!full_name) return { error: "Name is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name, phone })
    .eq("id", profile.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/profile");
  return { message: "Profile updated." };
}
