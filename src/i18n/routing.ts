import { defineRouting } from "next-intl/routing";

// Same 10 languages as the app. Every page is statically generated per locale: /en/…, /fr/…, /ar/… (RTL).
export const LOCALES = ["en", "fr", "de", "it", "es", "pt", "zh", "ru", "ko", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
});

export const LOCALE_META: Record<Locale, { label: string; flag: string; code: string; dir: "ltr" | "rtl"; og: string }> = {
  en: { label: "English", flag: "🇬🇧", code: "EN", dir: "ltr", og: "en_US" },
  fr: { label: "Français", flag: "🇫🇷", code: "FR", dir: "ltr", og: "fr_FR" },
  de: { label: "Deutsch", flag: "🇩🇪", code: "DE", dir: "ltr", og: "de_DE" },
  it: { label: "Italiano", flag: "🇮🇹", code: "IT", dir: "ltr", og: "it_IT" },
  es: { label: "Español", flag: "🇪🇸", code: "ES", dir: "ltr", og: "es_ES" },
  pt: { label: "Português", flag: "🇵🇹", code: "PT", dir: "ltr", og: "pt_PT" },
  zh: { label: "中文", flag: "🇨🇳", code: "ZH", dir: "ltr", og: "zh_CN" },
  ru: { label: "Русский", flag: "🇷🇺", code: "RU", dir: "ltr", og: "ru_RU" },
  ko: { label: "한국어", flag: "🇰🇷", code: "KO", dir: "ltr", og: "ko_KR" },
  ar: { label: "العربية", flag: "🇸🇦", code: "AR", dir: "rtl", og: "ar_SA" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Prefixes an internal path with the locale: "/" → "/fr", "/help" → "/fr/help", "/#pricing" → "/fr#pricing".
 * No trailing slashes: the static export writes fr.html / fr/help.html, which Cloudflare Pages serves at /fr, /fr/help.
 */
export function localePath(locale: Locale, path: string) {
  if (!path.startsWith("/")) return path;
  if (path === "/") return `/${locale}`;
  if (path.startsWith("/#")) return `/${locale}${path.slice(1)}`;
  return `/${locale}${path}`;
}

/** hreflang alternates for a path, for page metadata. */
export function languageAlternates(path: string) {
  const clean = path === "/" ? "" : path;
  return {
    ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}${clean}`])),
    "x-default": `/en${clean}`,
  };
}
