import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/session";
import { setBookingStatus } from "@/app/admin/actions";
import StatusBadge from "@/components/status-badge";
import { dateLabel, money } from "@/lib/format";

export const metadata = { title: "Bookings" };

export default async function AdminBookingsPage() {
  const staff = await requireStaff();
  const supabase = await createClient();

  const [{ data: bookings }, { data: customers }] = await Promise.all([
    supabase.from("bookings").select("id, start_date, end_date, total_cents, status, user_id, offices(name)").order("start_date", { ascending: false }),
    supabase.from("profiles").select("id, full_name, email").eq("tenant_id", staff.tenant_id),
  ]);
  const nameById = new Map((customers ?? []).map((c) => [c.id, c.full_name || c.email]));

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Bookings</h1>
      <div className="card mt-6 divide-y divide-white/10">
        {(bookings ?? []).length === 0 && <p className="p-6 text-sm text-slate-400">No bookings yet.</p>}
        {(bookings ?? []).map((b) => {
          const office = b.offices as unknown as { name: string } | null;
          return (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium text-white">{office?.name ?? "Office"} — {nameById.get(b.user_id) ?? "—"}</p>
                <p className="text-sm text-slate-400">{dateLabel(b.start_date)} – {dateLabel(b.end_date)} · {money(b.total_cents)}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={b.status} />
                {b.status !== "confirmed" && (
                  <form action={setBookingStatus}>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="status" value="confirmed" />
                    <button className="btn-outline px-3 py-1.5 text-xs">Confirm</button>
                  </form>
                )}
                {b.status !== "cancelled" && (
                  <form action={setBookingStatus}>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="status" value="cancelled" />
                    <button className="btn-ghost px-3 py-1.5 text-xs text-red-600">Cancel</button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
