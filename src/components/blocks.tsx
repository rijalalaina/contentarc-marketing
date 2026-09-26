import Link from "next/link";
import { Fragment } from "react";
import { localePath, type Locale } from "@/i18n/routing";

export type Block = { t: "h2" | "h3" | "p" | "ul" | "ol"; x: string | string[]; id?: string };

/** Minimal inline markup for translated long-form text: **bold** and [label](href). */
function Inline({ text, locale }: { text: string; locale: Locale }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i}>{bold[1]}</strong>;
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, href] = link;
          return href.startsWith("/") ? (
            <Link key={i} href={localePath(locale, href)}>
              {label}
            </Link>
          ) : (
            <a key={i} href={href}>
              {label}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));

export function Blocks({ blocks, locale, vars = {} }: { blocks: Block[]; locale: Locale; vars?: Record<string, string | number> }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === "ul" || b.t === "ol") {
          const List = b.t;
          return (
            <List key={i}>
              {(b.x as string[]).map((item, j) => (
                <li key={j}>
                  <Inline text={fill(item, vars)} locale={locale} />
                </li>
              ))}
            </List>
          );
        }
        const Tag = b.t;
        return (
          <Tag key={i} id={b.id}>
            <Inline text={fill(b.x as string, vars)} locale={locale} />
          </Tag>
        );
      })}
    </>
  );
}
