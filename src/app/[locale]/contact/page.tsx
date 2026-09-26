import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookOpenIcon, MailIcon } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/prose";
import { languageAlternates, localePath, type Locale } from "@/i18n/routing";
import { SITE } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "meta" });
  return {
    title: t("contactTitle"),
    description: t("contactDescription"),
    alternates: { canonical: `/${locale}/contact`, languages: languageAlternates("/contact") },
  };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <>
      <PageHero wide title={t("title")} intro={t("intro")} />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_20rem]">
        <ContactForm />
        <aside className="space-y-4">
          <div className="border-border bg-card rounded-3xl border p-6">
            <MailIcon aria-hidden className="text-violet size-5" />
            <h2 className="mt-3 font-sans font-semibold">{t("emailCardTitle")}</h2>
            <p className="text-muted mt-1 text-sm">{t("emailCardBody")}</p>
            <a
              href={`mailto:${SITE.contactEmail}`}
              dir="ltr"
              className="text-violet mt-2 inline-block text-sm font-semibold break-all underline"
            >
              {SITE.contactEmail}
            </a>
          </div>
          <div className="border-border bg-card rounded-3xl border p-6">
            <BookOpenIcon aria-hidden className="text-violet size-5" />
            <h2 className="mt-3 font-sans font-semibold">{t("helpCardTitle")}</h2>
            <p className="text-muted mt-1 text-sm">{t("helpCardBody")}</p>
            <Link href={localePath(locale, "/help")} className="text-violet mt-2 inline-block text-sm font-semibold underline">
              {t("helpCardLink")}
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
