import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Blocks, type Block } from "@/components/blocks";
import { PageHero, Prose } from "@/components/prose";
import { languageAlternates, type Locale } from "@/i18n/routing";
import { PIECES_PER_CAMPAIGN, SITE } from "@/lib/site";

const TOPICS = ["getting-started", "brand-brain", "campaigns", "editing", "export", "billing", "account", "sign-in"] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/help">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "meta" });
  return {
    title: t("helpTitle"),
    description: t("helpDescription"),
    alternates: { canonical: `/${locale}/help`, languages: languageAlternates("/help") },
  };
}

export default async function HelpPage({ params }: PageProps<"/[locale]/help">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "help" });

  return (
    <>
      <PageHero wide title={t("title")} intro={t("intro")} />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[14rem_1fr]">
        <nav aria-label={t("topicsLabel")} className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {TOPICS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className="text-muted hover:text-fg hover:bg-bg-soft block rounded-lg px-3 py-1.5 text-sm">
                  {t(`topics.${id}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Prose className="max-w-3xl">
          <Blocks
            blocks={t.raw("blocks") as Block[]}
            locale={locale}
            vars={{ pieces: PIECES_PER_CAMPAIGN, signUpUrl: SITE.signUpUrl }}
          />
        </Prose>
      </div>
    </>
  );
}
