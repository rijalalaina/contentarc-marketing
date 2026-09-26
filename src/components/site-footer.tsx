import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/logo";
import { localePath, type Locale } from "@/i18n/routing";
import { LEGAL, SITE } from "@/lib/site";

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
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-3">
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
