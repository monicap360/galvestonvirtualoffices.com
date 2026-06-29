"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/session";

// ---- Log a new piece of mail for a customer (with optional photo) ----
export async function logMail(formData: FormData) {
  const staff = await requireStaff();
  const supabase = await createClient();

  const userId = String(formData.get("user_id") || "");
  const type = String(formData.get("type") || "letter");
  const sender = String(formData.get("sender") || "") || null;
  const description = String(formData.get("description") || "") || null;
  if (!userId) return;

  // Link to the customer's most recent subscription, if any.
  const { data: sub } = await supabase
    .from("mailbox_subscriptions")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: item } = await supabase
    .from("mail_items")
    .insert({
      tenant_id: staff.tenant_id, user_id: userId, subscription_id: sub?.id ?? null,
      type, sender, description, status: "received",
    })
    .select("id")
    .single();

  // Upload photo if provided: stored at <user_id>/<mail_id>.<ext>
  const photo = formData.get("photo") as File | null;
  if (item && photo && photo.size > 0) {
    const ext = (photo.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${userId}/${item.id}.${ext}`;
    const bytes = new Uint8Array(await photo.arrayBuffer());
    const up = await supabase.storage.from("mail").upload(path, bytes, {
      contentType: photo.type || "image/jpeg",
      upsert: true,
    });
    if (!up.error) {
      await supabase.from("mail_items").update({ photo_path: path }).eq("id", item.id);
    }
  }

  revalidatePath("/admin/mail");
}

export async function setMailStatus(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !status) return;
  const patch: Record<string, unknown> = { status };
  if (status === "picked_up") patch.picked_up_at = new Date().toISOString();
  await supabase.from("mail_items").update(patch).eq("id", id);
  revalidatePath("/admin/mail");
}

// ---- Mark an invoice paid and activate whatever it was for ----
export async function markInvoicePaid(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const { data: inv } = await supabase
    .from("invoices")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", id)
    .select("related_type, related_id")
    .single();

  if (inv?.related_type === "subscription" && inv.related_id) {
    await supabase.from("mailbox_subscriptions")
      .update({ status: "active", started_at: new Date().toISOString() })
      .eq("id", inv.related_id);
  } else if (inv?.related_type === "booking" && inv.related_id) {
    await supabase.from("bookings").update({ status: "confirmed" }).eq("id", inv.related_id);
  } else if (inv?.related_type === "service_order" && inv.related_id) {
    await supabase.from("service_orders").update({ status: "active" }).eq("id", inv.related_id);
  }
  revalidatePath("/admin/invoices");
}

export async function setBookingStatus(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (id && status) await supabase.from("bookings").update({ status }).eq("id", id);
  revalidatePath("/admin/bookings");
}

export async function updateServiceOrder(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const quoteRaw = String(formData.get("quoted_price") || "").trim();
  if (!id) return;
  const patch: Record<string, unknown> = {};
  if (status) patch.status = status;
  if (quoteRaw) patch.quoted_price_cents = Math.round(parseFloat(quoteRaw) * 100);
  if (Object.keys(patch).length) await supabase.from("service_orders").update(patch).eq("id", id);
  revalidatePath("/admin/orders");
}

export async function markMessageHandled(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (id) await supabase.from("contact_messages").update({ handled: true }).eq("id", id);
  revalidatePath("/admin/messages");
}

// ---- Virtual assistant applications ----
export async function setApplicationStatus(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (id && status) await supabase.from("assistant_applications").update({ status }).eq("id", id);
  revalidatePath("/admin/assistants");
}

// Approve an applicant and add them to the active roster.
export async function approveApplication(formData: FormData) {
  const staff = await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const { data: app } = await supabase
    .from("assistant_applications")
    .select("name, email, phone, skills, availability, desired_rate_cents, bio")
    .eq("id", id)
    .single();
  if (!app) return;

  // Skills come in as a comma-separated string from the public form.
  const skills = (app.skills || "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  await supabase.from("assistants").insert({
    tenant_id: staff.tenant_id,
    name: app.name,
    email: app.email,
    phone: app.phone,
    headline: skills[0] ? `${skills[0]} specialist` : "Virtual Assistant",
    bio: app.bio ?? "",
    skills,
    hourly_rate_cents: app.desired_rate_cents ?? 0,
    availability: app.availability,
    active: true,
  });

  await supabase.from("assistant_applications").update({ status: "approved" }).eq("id", id);
  revalidatePath("/admin/assistants");
}

export async function setAssistantActive(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const active = String(formData.get("active") || "") === "true";
  if (id) await supabase.from("assistants").update({ active }).eq("id", id);
  revalidatePath("/admin/assistants");
}

// ---- Client requests (matching) ----
export async function updateClientRequest(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const assistantId = String(formData.get("assigned_assistant_id") || "");
  const status = String(formData.get("status") || "");
  const notes = String(formData.get("admin_notes") || "");

  const patch: Record<string, unknown> = {};
  patch.assigned_assistant_id = assistantId || null;
  if (status) patch.status = status;
  patch.admin_notes = notes || null;
  // Auto-advance to "matched" when an assistant is assigned and status is still new.
  if (assistantId && (!status || status === "new")) patch.status = "matched";

  await supabase.from("client_requests").update(patch).eq("id", id);
  revalidatePath("/admin/requests");
}
