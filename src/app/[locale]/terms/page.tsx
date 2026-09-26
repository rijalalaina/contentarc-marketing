import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Blocks, type Block } from "@/components/blocks";
import { PageHero, Prose } from "@/components/prose";
import { languageAlternates, type Locale } from "@/i18n/routing";
import { LEGAL, SITE } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/terms">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "meta" });
  return {
    title: t("termsTitle"),
    description: t("termsDescription"),
    alternates: { canonical: `/${locale}/terms`, languages: languageAlternates("/terms") },
  };
}

export default async function TermsPage({ params }: PageProps<"/[locale]/terms">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(LEGAL.lastUpdated));
  const vars = {
    company: LEGAL.company,
    jurisdiction: LEGAL.jurisdiction,
    number: LEGAL.companyNumber,
    address: LEGAL.address,
    companyEmail: LEGAL.companyEmail,
    email: SITE.contactEmail,
    site: SITE.url.replace("https://", ""),
    app: SITE.appUrl.replace("https://", ""),
  };

  return (
    <>
      <PageHero title={tm("termsTitle")} meta={t("lastUpdated", { date })} />
      <Prose className="mx-auto max-w-3xl px-4 sm:px-6">
        {locale !== "en" && (
          <p className="border-border bg-bg-soft rounded-xl border px-4 py-3 text-sm">{t("translationNotice")}</p>
        )}
        <Blocks blocks={t.raw("terms") as Block[]} locale={locale} vars={vars} />
        <h2>{t("operatorTitle")}</h2>
        <p>{t("operator", vars)}</p>
      </Prose>
    </>
  );
}
