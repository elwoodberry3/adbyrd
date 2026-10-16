import type { MetadataRoute } from "next";
import { legalDocs } from "@/lib/legal";
import { SITE_URL } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const main = [
    { path: "", priority: 1 },
    { path: "/what-we-do", priority: 0.9 },
    { path: "/about", priority: 0.8 },
    { path: "/process", priority: 0.8 },
    { path: "/contact", priority: 0.9 },
    { path: "/legal", priority: 0.3 },
  ];
  return [
    ...main.map((p) => ({ url: `${SITE_URL}${p.path}`, lastModified: now, changeFrequency: "monthly" as const, priority: p.priority })),
    ...legalDocs.map((d) => ({ url: `${SITE_URL}/legal/${d.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
