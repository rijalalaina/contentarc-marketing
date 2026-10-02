import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/logo";
import { localePath, type Locale } from "@/i18n/routing";
import { LEGAL, SITE } from "@/lib/site";
import { ALL_PRODUCTS_URL, SOCIAL_LINKS, otherProducts } from "@/lib/ecosystem";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const columns = [
    {
      title: t("product"),
      links: [
        { href: localePath(locale, "/#features"), label: tc("nav.features") },
        { href: localePath(locale, "/#pricing"), label: tc("nav.pricing") },
        { href: localePath(locale, "/#faq"), label: tc("nav.faq") },
        { href: SITE.signUpUrl, label: tc("startFree") },
      ],
    },
    {
      title: t("support"),
      links: [
        { href: localePath(locale, "/help"), label: t("helpCenter") },
        { href: localePath(locale, "/contact"), label: t("contact") },
        { href: `mailto:${SITE.contactEmail}`, label: SITE.contactEmail },
      ],
    },
    {
      title: t("legal"),
      links: [
        { href: localePath(locale, "/privacy"), label: t("privacy") },
        { href: localePath(locale, "/terms"), label: t("terms") },
      ],
    },
  ];

  return (
    <footer className="border-border mt-24 border-t">
      <div className="bg-brand-spectrum h-px w-full opacity-60" aria-hidden />
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="col-span-2 space-y-3 md:col-span-3 lg:col-span-1">
          <Logo />
          <p className="text-muted max-w-xs text-sm">{t("tagline")}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="font-sans text-sm font-semibold">{col.title}</h2>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  {l.href.startsWith("/") ? (
                    <Link href={l.href} className="text-muted hover:text-fg text-sm transition-colors">
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} dir="ltr" className="text-muted hover:text-fg text-sm break-all transition-colors">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {/* Blissfulplan Publishing's other products. */}
        <div>
          <h2 className="font-sans text-sm font-semibold">{t("otherProducts")}</h2>
          <ul className="mt-3 space-y-2">
            {otherProducts("contentarc.app").map((p) => (
              <li key={p.url}>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-fg text-sm transition-colors">
                  {p.name}
                </a>
              </li>
            ))}
            <li>
              <a href={ALL_PRODUCTS_URL} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-fg text-xs underline-offset-4 transition-colors hover:underline">
                {t("exploreAll")}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-border mx-auto flex max-w-6xl flex-wrap items-center gap-3 border-t px-4 py-5 sm:px-6">
        <span className="text-muted text-xs font-medium">{t("follow")}</span>
        <ul className="flex flex-wrap gap-2">
          {SOCIAL_LINKS.map((s) => (
            <li key={s.name}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.ariaLabel}
                title={s.name}
                className="text-muted hover:text-fg border-border hover:border-fg/40 flex size-9 items-center justify-center rounded-full border transition-colors"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
                  <path d={s.path} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-border text-muted mx-auto max-w-6xl space-y-2 border-t px-4 py-6 text-xs sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p>{t("rights", { year: new Date().getFullYear() })}</p>
          <p>{t("madeFor")}</p>
        </div>
        <p>
          {t("operator", {
            company: LEGAL.company,
            jurisdiction: LEGAL.jurisdiction,
            number: LEGAL.companyNumber,
            address: LEGAL.address,
          })}{" "}
          <a href={`mailto:${LEGAL.companyEmail}`} dir="ltr" className="hover:text-fg underline underline-offset-2">
            {LEGAL.companyEmail}
          </a>
        </p>
      </div>
    </footer>
  );
}
