import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/session";
import { markMessageHandled } from "@/app/admin/actions";
import { dateLabel } from "@/lib/format";

export const metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  await requireStaff();
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("id, name, email, phone, subject, message, handled, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Contact messages</h1>
      <div className="mt-6 space-y-4">
        {(messages ?? []).length === 0 && <p className="card p-6 text-sm text-slate-400">No messages yet.</p>}
        {(messages ?? []).map((m) => (
          <div key={m.id} className={`card p-5 ${m.handled ? "opacity-60" : ""}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-white">{m.name} {m.subject ? `· ${m.subject}` : ""}</p>
                <p className="text-sm text-slate-400">
                  <a href={`mailto:${m.email}`} className="text-fuchsia-300 hover:underline">{m.email}</a>
                  {m.phone ? ` · ${m.phone}` : ""} · {dateLabel(m.created_at)}
                </p>
              </div>
              {!m.handled && (
                <form action={markMessageHandled}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="btn-outline px-3 py-1.5 text-xs">Mark handled</button>
                </form>
              )}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
