"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { Menu, menuItemClass } from "@/components/menu";

const OPTIONS = [
  { value: "light", icon: SunIcon },
  { value: "dark", icon: MoonIcon },
  { value: "system", icon: MonitorIcon },
] as const;

const subscribe = () => () => {};

export function ThemeToggle() {
  const t = useTranslations("common");
  const { theme, setTheme } = useTheme();
  // Theme is unknown until mounted; render the System icon on the server to avoid a hydration mismatch.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const current = mounted ? (theme ?? "system") : "system";
  const Icon = OPTIONS.find((o) => o.value === current)?.icon ?? MonitorIcon;

  return (
    <Menu label={t("theme")} trigger={<Icon aria-hidden className="size-4" />}>
      {(close) =>
        OPTIONS.map(({ value, icon: ItemIcon }) => (
          <button
            key={value}
            type="button"
            role="menuitemradio"
            aria-checked={current === value}
            onClick={() => {
              setTheme(value);
              close();
            }}
            className={menuItemClass}
          >
            <ItemIcon aria-hidden className="size-4" />
            <span className="flex-1">{t(value)}</span>
            {current === value && <CheckIcon aria-hidden className="size-4" />}
          </button>
        ))
      }
    </Menu>
  );
}
