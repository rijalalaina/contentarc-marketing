import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter, Noto_Sans_Arabic, Poppins } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LOCALES, LOCALE_META, languageAlternates, routing } from "@/i18n/routing";
import { SITE } from "@/lib/site";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext", "cyrillic"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin", "latin-ext"], weight: ["600", "700"] });
const notoArabic = Noto_Sans_Arabic({ variable: "--font-arabic", subsets: ["arabic"], preload: false });

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t("title"), template: `%s · ${SITE.name}` },
    description: t("description"),
    applicationName: SITE.name,
    alternates: { canonical: `/${locale}`, languages: languageAlternates("/") },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: LOCALE_META[locale].og,
      url: `${SITE.url}/${locale}`,
      title: t("title"),
      description: t("description"),
      images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: t("ogAlt") }],
    },
    twitter: { card: "summary_large_image", images: ["/brand/og.jpg"] },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1020" },
  ],
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "common" });
  const { dir } = LOCALE_META[locale];

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${notoArabic.variable}`}
    >
      <body className="flex min-h-svh flex-col" suppressHydrationWarning>
        <NextIntlClientProvider>
          <Providers>
            <a
              href="#main"
              className="bg-card sr-only z-50 rounded-lg px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:start-3"
            >
              {t("skip")}
            </a>
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter locale={locale} />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
