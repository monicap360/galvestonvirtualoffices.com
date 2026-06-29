import type { MetadataRoute } from "next";
import { INDUSTRIES } from "@/lib/industries";
import { LOCATIONS } from "@/lib/locations";
import { POSTS } from "@/lib/blog";

const SITE_URL = "https://galvestonvirtualoffices.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "", "/virtual-assistants", "/ai-assistant", "/ai-studio", "/mailboxes", "/offices",
    "/services/marketing", "/services/platforms", "/industries", "/pricing", "/contact", "/blog",
    "/virtual-assistants/request", "/virtual-assistants/apply",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.8,
  }));

  for (const i of INDUSTRIES) {
    entries.push({ url: `${SITE_URL}/industries/${i.slug}`, changeFrequency: "weekly", priority: 0.7 });
  }
  for (const l of LOCATIONS) {
    entries.push({ url: `${SITE_URL}/locations/${l.slug}`, changeFrequency: "weekly", priority: 0.9 });
  }
  for (const p of POSTS) {
    entries.push({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.date, changeFrequency: "monthly", priority: 0.6 });
  }
  return entries;
}
