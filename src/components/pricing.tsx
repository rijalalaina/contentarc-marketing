"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckIcon, SparklesIcon } from "lucide-react";
import { ctaClass } from "@/components/cta";
import { PIECES_PER_CAMPAIGN, PLANS, SITE, type Interval } from "@/lib/site";
import { cn } from "@/lib/cn";

export function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const [interval, setInterval] = useState<Interval>("month");

  const usd = (n: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
  const num = (n: number) => new Intl.NumberFormat(locale).format(n);

  return (
    <div className="space-y-10">
      <div className="flex justify-center">
        <div role="radiogroup" aria-label={t("periodLabel")} className="border-border bg-card inline-flex rounded-full border p-1">
          {(["month", "year"] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={interval === value}
              onClick={() => setInterval(value)}
              className={cn(
                "flex h-9 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors",
                interval === value ? "bg-navy dark:text-navy text-white dark:bg-white" : "text-muted hover:text-fg",
              )}
            >
              {value === "month" ? t("monthly") : t("yearly")}
              {value === "year" && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[0.7rem] whitespace-nowrap",
                    interval === "year" ? "bg-white/20 dark:bg-navy/15" : "bg-brand-gradient text-white",
                  )}
                >
                  {t("twoMonthsFree")}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((plan) => {
          const name = t(`plans.${plan.id}.name`);
          const price = plan.prices ? (interval === "year" ? plan.prices.year / 12 : plan.prices.month) : 0;
          const features = [
            t("features.campaigns", { count: num(plan.campaigns), pieces: num(plan.campaigns * PIECES_PER_CAMPAIGN) }),
            plan.products === null ? t("features.productsUnlimited") : t("features.products", { count: plan.products }),
            t("features.rewrites", { count: num(plan.rewrites) }),
            t("features.publishing", { count: plan.publishingBrands ?? 0 }),
            t("features.images", { count: plan.images }),
            t("features.formats"),
            t("features.seo"),
            t("features.export"),
            t("features.languages"),
            ...(plan.prioritySupport ? [t("features.priority")] : []),
          ];
          return (
            <section
              key={plan.id}
              aria-labelledby={`plan-${plan.id}`}
              className={cn(
                "bg-card relative flex flex-col rounded-3xl border p-6",
                plan.popular
                  ? "border-2 border-transparent shadow-xl [background:linear-gradient(var(--card),var(--card))_padding-box,linear-gradient(135deg,#6a2ed0,#fc5a7f,#feab3b)_border-box]"
                  : "border-border",
              )}
            >
              {plan.popular && (
                <span className="bg-brand-gradient absolute -top-3 start-6 rounded-full px-3 py-1 text-xs font-semibold text-white">
                  {t("mostPopular")}
                </span>
              )}
              <h3 id={`plan-${plan.id}`} className="text-xl font-semibold">
                {name}
              </h3>
              <p className="text-muted mt-1 min-h-10 text-sm">{t(`plans.${plan.id}.tagline`)}</p>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span dir="ltr" className="font-display text-4xl font-bold tabular-nums">
                  {usd(price)}
                </span>
                <span className="text-muted text-sm">{t("perMonth")}</span>
              </div>
              <p className="text-muted mt-1 h-5 text-xs">
                {plan.prices && interval === "year"
                  ? t("billedYearly", { amount: usd(plan.prices.year) })
                  : plan.prices
                    ? t("billedMonthly")
                    : t("freeForever")}
              </p>
              <a href={SITE.signUpUrl} className={ctaClass({ variant: plan.popular ? "primary" : "secondary", className: "mt-6 w-full" })}>
                {plan.popular && <SparklesIcon aria-hidden className="size-4" />}
                {plan.prices ? t("choose", { plan: name }) : t("startFree")}
              </a>
              <ul className="mt-6 space-y-2.5 text-sm">
                {features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <CheckIcon aria-hidden className="text-violet mt-0.5 size-4 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <p className="text-muted text-center text-xs">{t("footnote")}</p>
    </div>
  );
}
