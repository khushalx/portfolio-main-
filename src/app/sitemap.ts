import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!origin) return []; // Populate only after a real public domain is configured.
  return [{ url: origin, priority: 1 }, ...projects.map(project => ({ url: `${origin}/work/${project.slug}`, priority: 0.8 }))];
}
