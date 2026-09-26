// Shared by the bare-path Pages Functions: pick the visitor's language and redirect to /{locale}{path}.
export const LOCALES = ["en", "fr", "de", "it", "es", "pt", "zh", "ru", "ko", "ar"] as const;
type Locale = (typeof LOCALES)[number];
const isLocale = (v: unknown): v is Locale => typeof v === "string" && (LOCALES as readonly string[]).includes(v);

export function pickLocale(request: Request): Locale {
  const cookie = request.headers.get("cookie")?.match(/(?:^|;\s*)NEXT_LOCALE=([a-z]{2})/)?.[1];
  if (isLocale(cookie)) return cookie;
  const ranked = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { base: tag.toLowerCase().slice(0, 2), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return ranked.find((r) => isLocale(r.base))?.base as Locale | undefined ?? "en";
}

export function redirectToLocale(request: Request, path: string, hash = "") {
  const url = new URL(request.url);
  const target = `/${pickLocale(request)}${path === "/" ? "" : path}${url.search}${hash}`;
  return new Response(null, {
    status: 302,
    headers: { location: target, vary: "Accept-Language, Cookie", "cache-control": "private, no-store" },
  });
}
