import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/session";
import StatusBadge from "@/components/status-badge";
import { dateLabel, titleCase } from "@/lib/format";

export const metadata = { title: "Mail" };

export default async function MailPage() {
  await requireProfile();
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("mail_items")
    .select("id, type, sender, description, photo_path, status, received_at")
    .order("received_at", { ascending: false });

  // Sign photo URLs (private bucket).
  const withPhotos = await Promise.all(
    (items ?? []).map(async (m) => {
      let photoUrl: string | null = null;
      if (m.photo_path) {
        const { data } = await supabase.storage.from("mail").createSignedUrl(m.photo_path, 60 * 10);
        photoUrl = data?.signedUrl ?? null;
      }
      return { ...m, photoUrl };
    })
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Your mail</h1>
      <p className="mt-1 text-slate-400">Everything we&apos;ve received for you. Come by during business hours to pick up.</p>

      {withPhotos.length === 0 ? (
        <div className="card mt-6 p-8 text-center text-slate-400">
          No mail yet. When something arrives, we&apos;ll photograph it and it&apos;ll show up right here.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {withPhotos.map((m) => (
            <div key={m.id} className="card overflow-hidden">
              {m.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.photoUrl} alt="Mail item" className="h-40 w-full object-cover" />
              ) : (
                <div className="grid h-40 w-full place-items-center bg-white/5 text-4xl">
                  {m.type === "letter" ? "✉️" : "📦"}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{titleCase(m.type)}</span>
                  <StatusBadge status={m.status} />
                </div>
                {m.sender && <p className="mt-1 text-sm text-slate-400">From: {m.sender}</p>}
                {m.description && <p className="mt-1 text-sm text-slate-400">{m.description}</p>}
                <p className="mt-2 text-xs text-slate-500">Received {dateLabel(m.received_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
