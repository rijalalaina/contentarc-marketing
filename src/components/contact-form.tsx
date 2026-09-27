"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2Icon, Loader2Icon, SendIcon } from "lucide-react";
import { ctaClass } from "@/components/cta";
import { localePath } from "@/i18n/routing";
import { SITE } from "@/lib/site";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TOPICS = ["general", "sales", "support", "billing", "partnership", "press"] as const;
const ERROR_CODES = ["name", "email", "message", "verification", "not_configured", "send_failed"] as const;

const field =
  "border-border bg-card placeholder:text-muted/70 focus-visible:border-violet w-full rounded-xl border px-3.5 py-2.5 text-[0.95rem] outline-none transition-colors";

const DRAFT_KEY = "contentarc:draft:contact";
const DRAFT_FIELDS = ["name", "email", "topic", "message"] as const;

export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    // Restore an unsent message after a refresh.
    const form = formRef.current;
    if (!form) return;
    try {
      const saved = JSON.parse(window.localStorage.getItem(DRAFT_KEY) ?? "null") as Record<string, string> | null;
      if (!saved) return;
      for (const name of DRAFT_FIELDS) {
        const el = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
        if (el && typeof saved[name] === "string") el.value = saved[name];
      }
    } catch {
      // storage unavailable: nothing to restore
    }
  }, []);

  // Autosave what's typed so a refresh or closed tab doesn't lose it.
  const saveDraft = (form: HTMLFormElement) => {
    try {
      const data = new FormData(form);
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(Object.fromEntries(DRAFT_FIELDS.map((n) => [n, String(data.get(n) ?? "")]))));
    } catch {
      // storage unavailable: autosave is best-effort
    }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    setErrorCode(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, locale, newsletter: data.newsletter === "on", elapsed: Date.now() - startedAt.current }),
      });
      const body = (await res.json().catch(() => null)) as { code?: string } | null;
      if (!res.ok) throw new Error(body?.code ?? "generic");
      setStatus("sent");
      form.reset();
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
    } catch (err) {
      const code = err instanceof Error ? err.message : "generic";
      setStatus("error");
      setErrorCode((ERROR_CODES as readonly string[]).includes(code) ? code : "generic");
      // Turnstile tokens are single-use: get a fresh one for the retry.
      (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="border-border bg-card flex flex-col items-center gap-3 rounded-3xl border p-10 text-center">
        <CheckCircle2Icon aria-hidden className="text-violet size-10" />
        <h2 className="text-2xl font-semibold">{t("sentTitle")}</h2>
        <p className="text-muted max-w-sm">{t("sentBody")}</p>
        <button type="button" onClick={() => setStatus("idle")} className={ctaClass({ variant: "secondary", className: "mt-2" })}>
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      onInput={(e) => saveDraft(e.currentTarget)}
      onChange={(e) => saveDraft(e.currentTarget)}
      className="border-border bg-card space-y-5 rounded-3xl border p-6 sm:p-8"
    >
      {TURNSTILE_SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-semibold">{t("name")}</span>
          <input name="name" required maxLength={120} autoComplete="name" className={field} />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-semibold">{t("email")}</span>
          <input name="email" type="email" required maxLength={254} autoComplete="email" dir="ltr" className={field} />
        </label>
      </div>
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold">{t("topic")}</span>
        <select name="topic" defaultValue="general" className={field}>
          {TOPICS.map((key) => (
            <option key={key} value={key}>
              {t(`topics.${key}`)}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold">{t("message")}</span>
        <textarea name="message" required minLength={10} maxLength={5000} rows={6} className={`${field} resize-y`} />
      </label>

      {/* Honeypot: hidden from people, tempting for bots. */}
      <div aria-hidden className="absolute -start-[9999px] h-0 overflow-hidden">
        <label>
          {t("honeypot")}
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="text-muted flex items-start gap-2.5 text-sm">
        <input type="checkbox" name="newsletter" className="accent-violet mt-1 size-4" />
        <span>{t("newsletter")}</span>
      </label>

      {TURNSTILE_SITE_KEY && <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="auto" data-language={locale} />}

      {status === "error" && errorCode && (
        <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {t(`errors.${errorCode as (typeof ERROR_CODES)[number] | "generic"}`)}{" "}
          {t.rich("orEmail", {
            email: SITE.contactEmail,
            link: (chunks) => (
              <a className="underline" dir="ltr" href={`mailto:${SITE.contactEmail}`}>
                {chunks}
              </a>
            ),
          })}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted text-xs">
          {t.rich("privacyNote", {
            privacy: (chunks) => (
              <Link className="text-violet underline" href={localePath(locale, "/privacy")}>
                {chunks}
              </Link>
            ),
          })}
        </p>
        <button type="submit" disabled={status === "sending"} className={ctaClass({ size: "lg" })}>
          {status === "sending" ? <Loader2Icon aria-hidden className="size-4 animate-spin" /> : <SendIcon aria-hidden className="size-4" />}
          {status === "sending" ? t("sending") : t("send")}
        </button>
      </div>
    </form>
  );
}
