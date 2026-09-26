"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { CheckIcon } from "lucide-react";
import { Menu, menuItemClass } from "@/components/menu";
import { LOCALES, LOCALE_COOKIE, LOCALE_META, type Locale } from "@/i18n/routing";

/** Same page in another language: swaps the first path segment. */
function switchPath(pathname: string, target: Locale) {
  const parts = pathname.split("/");
  parts[1] = target;
  return parts.join("/").replace(/\/$/, "") || `/${target}`;
}

function remember(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const active = useLocale();
  const pathname = usePathname();

  return (
    <Menu
      label={t("language")}
      trigger={
        <>
          <span aria-hidden className="text-base leading-none">
            {LOCALE_META[active].flag}
          </span>
          <span className="text-xs tracking-wide">{LOCALE_META[active].code}</span>
        </>
      }
    >
      {(close) =>
        LOCALES.map((l) => (
          <Link
            key={l}
            href={switchPath(pathname, l)}
            hrefLang={l}
            lang={l}
            role="menuitemradio"
            aria-checked={l === active}
            onClick={() => {
              remember(l);
              close();
            }}
            className={menuItemClass}
          >
            <span aria-hidden className="text-base leading-none">
              {LOCALE_META[l].flag}
            </span>
            <span className="flex-1">{LOCALE_META[l].label}</span>
            <span className="text-muted text-[0.7rem]">{LOCALE_META[l].code}</span>
            {l === active && <CheckIcon aria-hidden className="size-4" />}
          </Link>
        ))
      }
    </Menu>
  );
}
