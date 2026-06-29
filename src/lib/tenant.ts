import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type Tenant = {
  id: string;
  slug: string;
  name: string;
  support_email: string | null;
  mailing_address: string | null;
  brand_color: string | null;
};

// Resolve the active tenant from the request host (subdomain or custom domain),
// falling back to NEXT_PUBLIC_DEFAULT_TENANT for local dev.
export async function getTenant(): Promise<Tenant | null> {
  const h = await headers();
  const host = (h.get("host") || "").split(":")[0];
  const parts = host.split(".");

  let slug = process.env.NEXT_PUBLIC_DEFAULT_TENANT || "galveston";
  // e.g. "acme.galvestonvirtualoffices.com" -> "acme"
  if (parts.length > 2 && parts[0] !== "www") {
    slug = parts[0];
  }

  const supabase = await createClient();

  // Match by custom domain first, then by slug.
  const byDomain = await supabase
    .from("tenants")
    .select("id, slug, name, support_email, mailing_address, brand_color")
    .eq("domain", host)
    .maybeSingle();
  if (byDomain.data) return byDomain.data;

  const bySlug = await supabase
    .from("tenants")
    .select("id, slug, name, support_email, mailing_address, brand_color")
    .eq("slug", slug)
    .maybeSingle();

  return bySlug.data ?? null;
}
