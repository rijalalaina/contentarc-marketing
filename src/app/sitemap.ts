import type { MetadataRoute } from "next";
import { LOCALES, languageAlternates } from "@/i18n/routing";
import { LEGAL, SITE } from "@/lib/site";

export const dynamic = "force-static";

const PAGES = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/help", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(LEGAL.lastUpdated);
  const abs = (p: string) => `${SITE.url}${p}`;
  return PAGES.flatMap(({ path, priority, changeFrequency }) => {
    const languages = Object.fromEntries(Object.entries(languageAlternates(path)).map(([k, v]) => [k, abs(v)]));
    return LOCALES.map((locale) => ({
      url: abs(path === "/" ? `/${locale}` : `/${locale}${path}`),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
