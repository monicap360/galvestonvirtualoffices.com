import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/session";
import { dateLabel, titleCase } from "@/lib/format";

export const metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const staff = await requireStaff();
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, role, created_at")
    .eq("tenant_id", staff.tenant_id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 text-left text-slate-500">
            <tr>
              <th className="p-3">Name</th><th className="p-3">Email</th>
              <th className="p-3">Phone</th><th className="p-3">Role</th><th className="p-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(customers ?? []).length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-slate-500">No customers yet.</td></tr>
            )}
            {(customers ?? []).map((c) => (
              <tr key={c.id}>
                <td className="p-3 font-medium text-slate-900">{c.full_name || "—"}</td>
                <td className="p-3 text-slate-600">{c.email}</td>
                <td className="p-3 text-slate-600">{c.phone || "—"}</td>
                <td className="p-3">{titleCase(c.role)}</td>
                <td className="p-3 text-slate-500">{dateLabel(c.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
