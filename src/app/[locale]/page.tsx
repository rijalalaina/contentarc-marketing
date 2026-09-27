import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  AtSignIcon,
  BrainIcon,
  BriefcaseBusinessIcon,
  CheckIcon,
  SendIcon,
  FlameIcon,
  GlobeIcon,
  LayersIcon,
  LightbulbIcon,
  MailIcon,
  MessageCircleIcon,
  MessageSquareTextIcon,
  MonitorPlayIcon,
  PanelsTopLeftIcon,
  SearchIcon,
  SmartphoneIcon,
  WandSparklesIcon,
  type LucideIcon,
} from "lucide-react";
import { Cta } from "@/components/cta";
import { Faq, type FaqItem } from "@/components/faq";
import { Pricing } from "@/components/pricing";
import { Section } from "@/components/section";
import { localePath, type Locale } from "@/i18n/routing";
import { PLATFORMS, PIECES_PER_CAMPAIGN, SITE } from "@/lib/site";

const PLATFORM_ICON: Record<(typeof PLATFORMS)[number]["id"], LucideIcon> = {
  youtube: MonitorPlayIcon,
  short_video: SmartphoneIcon,
  linkedin: BriefcaseBusinessIcon,
  x_thread: AtSignIcon,
  carousel: PanelsTopLeftIcon,
  story: MessageSquareTextIcon,
  newsletter: MailIcon,
};

const FEATURES = [
  { key: "brandBrain", icon: BrainIcon },
  { key: "angles", icon: FlameIcon },
  { key: "seo", icon: SearchIcon },
  { key: "dm", icon: MessageCircleIcon },
  { key: "copilot", icon: WandSparklesIcon },
  { key: "export", icon: SendIcon },
  { key: "languages", icon: GlobeIcon },
  { key: "week", icon: CheckIcon },
] as const;

const AUDIENCES = ["ebook", "saas", "digital", "brands"] as const;
const FAQ_KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const pieces = PIECES_PER_CAMPAIGN;
  const link = (path: string) =>
    function RichLink(chunks: React.ReactNode) {
      return (
        <Link className="text-violet underline" href={localePath(locale, path)}>
          {chunks}
        </Link>
      );
    };

  const faq: FaqItem[] = FAQ_KEYS.map((n) => ({
    q: t(`faq.q${n}`),
    a: <p>{t.rich(`faq.a${n}`, { pieces, terms: link("/terms"), privacy: link("/privacy") })}</p>,
  }));

  return (
    <>
      {/* Hero */}
      <section className="glow relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
          <div>
            <p className="border-border bg-card text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
              <span className="bg-brand-spectrum size-2 rounded-full" aria-hidden />
              {t("badge", { pieces })}
            </p>
            <h1 className="mt-5 text-4xl leading-[1.12] font-bold sm:text-5xl lg:text-6xl">
              {t("heroTitle1")}
              <br />
              <span className="text-brand-gradient">{t("heroTitle2")}</span>
            </h1>
            <p className="text-muted mt-6 max-w-xl text-lg leading-relaxed">{t("heroBody", { pieces })}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Cta href={SITE.signUpUrl} size="lg" arrow>
                {tc("startFree")}
              </Cta>
              <Cta href="#how-it-works" size="lg" variant="secondary">
                {t("heroSecondary")}
              </Cta>
            </div>
            <p className="text-muted mt-4 text-sm">{t("trust")}</p>
          </div>
          <div className="relative">
            <div className="bg-brand-spectrum absolute -inset-3 rounded-[2rem] opacity-25 blur-2xl" aria-hidden />
            <Image
              src="/brand/hero.webp"
              alt={t("heroAlt")}
              width={896}
              height={560}
              priority
              className="border-border relative rounded-3xl border shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Formats strip */}
      <section aria-label={t("formatsLabel")} className="border-border bg-card/60 border-y">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 sm:grid-cols-4 sm:px-6 lg:grid-cols-7">
          {PLATFORMS.map(({ id, count }) => {
            const Icon = PLATFORM_ICON[id];
            return (
              <li key={id} className="flex flex-col items-center gap-1.5 py-6 text-center">
                <Icon aria-hidden className="text-violet size-5" />
                <span className="font-display text-2xl font-semibold tabular-nums">{count}</span>
                <span className="text-muted text-xs">{t(`platforms.${id}.label`)}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* How it works */}
      <Section id="how-it-works" eyebrow={t("how.eyebrow")} title={t("how.title")} intro={t("how.intro")}>
        <ol className="grid gap-5 md:grid-cols-3">
          {([
            { icon: BrainIcon, n: 1 },
            { icon: LightbulbIcon, n: 2 },
            { icon: LayersIcon, n: 3 },
          ] as const).map(({ icon: Icon, n }) => (
            <li key={n} className="border-border bg-card relative rounded-3xl border p-6">
              <span className="bg-brand-gradient grid size-11 place-items-center rounded-2xl text-white">
                <Icon aria-hidden className="size-5" />
              </span>
              <span className="text-muted font-display absolute end-6 top-6 text-sm font-semibold">0{n}</span>
              <h3 className="mt-5 text-lg font-semibold">{t(`how.s${n}Title`, { pieces })}</h3>
              <p className="text-muted mt-2 leading-relaxed">{t(`how.s${n}Body`)}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* The matrix */}
      <section aria-labelledby="matrix-title" className="bg-bg-soft">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-violet mb-3 text-sm font-semibold tracking-wide uppercase">{t("matrix.eyebrow")}</p>
            <h2 id="matrix-title" className="text-3xl font-semibold sm:text-4xl">
              {t("matrix.title", { pieces })}
            </h2>
            <p className="text-muted mt-4 text-lg">{t("matrix.intro")}</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORMS.map(({ id, count }) => {
              const Icon = PLATFORM_ICON[id];
              return (
                <li key={id} className="border-border bg-card flex gap-4 rounded-2xl border p-5">
                  <span className="bg-bg-soft text-violet grid size-11 shrink-0 place-items-center rounded-xl">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{t("matrix.item", { count, label: t(`platforms.${id}.label`) })}</p>
                    <p className="text-muted mt-1 text-sm leading-relaxed">{t(`platforms.${id}.detail`)}</p>
                  </div>
                </li>
              );
            })}
            <li className="bg-brand-gradient flex flex-col justify-center gap-2 rounded-2xl p-5 text-white">
              <p className="font-display text-3xl font-bold">{t("matrix.seoTitle")}</p>
              <p className="text-sm text-white/85">{t("matrix.seoBody")}</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Features */}
      <Section id="features" eyebrow={t("features.eyebrow")} title={t("features.title")} intro={t("features.intro")}>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ key, icon: Icon }) => (
            <li key={key} className="border-border bg-card rounded-2xl border p-5">
              <Icon aria-hidden className="text-violet size-5" />
              <h3 className="mt-4 font-semibold">{t(`features.${key}.title`)}</h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">{t(`features.${key}.body`)}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Audiences */}
      <section aria-labelledby="for-title" className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-border bg-card grid gap-8 rounded-3xl border p-8 sm:p-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 id="for-title" className="text-2xl font-semibold sm:text-3xl">
              {t("audiences.title1")} <span className="text-brand-gradient">{t("audiences.title2")}</span>
            </h2>
            <p className="text-muted mt-3">{t("audiences.intro")}</p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {AUDIENCES.map((key) => (
              <li key={key}>
                <p className="font-semibold">{t(`audiences.${key}.title`)}</p>
                <p className="text-muted mt-1 text-sm leading-relaxed">{t(`audiences.${key}.body`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <Section id="pricing" eyebrow={t("pricing.eyebrow")} title={t("pricing.title")} intro={t("pricing.intro")}>
        <Pricing />
      </Section>

      {/* FAQ */}
      <Section id="faq" eyebrow={t("faq.eyebrow")} title={t("faq.title")} className="max-w-3xl">
        <Faq items={faq} />
        <p className="text-muted mt-6 text-center text-sm">
          {t.rich("faq.more", { help: link("/help"), contact: link("/contact") })}
        </p>
      </Section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="bg-navy relative overflow-hidden rounded-3xl px-6 py-14 text-center text-white sm:px-12">
          <div className="bg-brand-spectrum absolute inset-x-0 bottom-0 h-1.5" aria-hidden />
          <Image src="/brand/mark.png" alt="" width={194} height={222} className="mx-auto h-14 w-auto" />
          <h2 className="mt-6 text-3xl font-semibold sm:text-4xl">{t("final.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75">{t("final.body", { pieces })}</p>
          <div className="mt-8 flex justify-center">
            <Cta href={SITE.signUpUrl} size="lg" arrow>
              {t("final.cta")}
            </Cta>
          </div>
        </div>
      </section>
    </>
  );
}
