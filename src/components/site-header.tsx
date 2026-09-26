"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { MenuIcon, XIcon } from "lucide-react";
import { Cta } from "@/components/cta";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { localePath } from "@/i18n/routing";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const t = useTranslations("common");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[border-color]",
        "bg-bg/85 border-b backdrop-blur-md",
        scrolled || open ? "border-border" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="ms-2 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.path}
              href={localePath(locale, item.path)}
              className="text-muted hover:text-fg rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="ms-2 hidden items-center gap-2 lg:flex">
            <Cta href={SITE.signInUrl} variant="ghost">
              {t("signIn")}
            </Cta>
            <Cta href={SITE.signUpUrl}>{t("startFree")}</Cta>
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t("menuClose") : t("menuOpen")}
            className="hover:bg-bg-soft grid size-10 place-items-center rounded-lg lg:hidden"
          >
            {open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-border border-t px-4 pt-2 pb-4 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.path}
              href={localePath(locale, item.path)}
              onClick={() => setOpen(false)}
              className="hover:bg-bg-soft block rounded-lg px-3 py-3 text-base font-medium"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Cta href={SITE.signInUrl} variant="secondary">
              {t("signIn")}
            </Cta>
            <Cta href={SITE.signUpUrl}>{t("startFree")}</Cta>
          </div>
        </nav>
      )}
    </header>
  );
}
