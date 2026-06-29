import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS. SERVER ONLY. Never import into client code.
// Use sparingly, for privileged operations (e.g. provisioning, webhooks).
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
