import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-[opacity,background-color,border-color] disabled:pointer-events-none disabled:opacity-50";
const sizes = { md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base" } as const;
const variants = {
  primary: "bg-brand-gradient text-white shadow-[0_8px_24px_-8px_rgb(165_52_216/0.55)] hover:opacity-90",
  secondary: "border border-border bg-card text-fg hover:border-violet/50",
  ghost: "text-fg hover:bg-bg-soft",
} as const;

export function ctaClass({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
} = {}) {
  return cn(base, sizes[size], variants[variant], className);
}

export function Cta({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  arrow?: boolean;
  className?: string;
}) {
  const external = href.startsWith("http");
  const cls = ctaClass({ variant, size, className });
  const content = (
    <>
      {children}
      {arrow && <ArrowRightIcon aria-hidden className="size-4 rtl:-scale-x-100" />}
    </>
  );
  return external ? (
    <a href={href} className={cls}>
      {content}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
