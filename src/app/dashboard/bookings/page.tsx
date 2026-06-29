import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/session";
import StatusBadge from "@/components/status-badge";
import { dateLabel, money } from "@/lib/format";

export const metadata = { title: "Bookings" };

export default async function BookingsPage() {
  await requireProfile();
  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, start_date, end_date, total_cents, status, offices(name, type)")
    .order("start_date", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Your bookings</h1>
        <Link href="/offices" className="btn-primary">Book a space</Link>
      </div>

      {!bookings || bookings.length === 0 ? (
        <div className="card mt-6 p-8 text-center text-slate-500">No bookings yet.</div>
      ) : (
        <div className="card mt-6 divide-y divide-slate-100">
          {bookings.map((b) => {
            const office = b.offices as unknown as { name: string; type: string } | null;
            return (
              <div key={b.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium text-slate-900">{office?.name ?? "Office"}</p>
                  <p className="text-sm text-slate-500">{dateLabel(b.start_date)} – {dateLabel(b.end_date)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{money(b.total_cents)}</p>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
