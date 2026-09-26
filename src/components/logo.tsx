"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { cn } from "@/lib/cn";

export function Logo({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const locale = useLocale();
  return (
    <Link href={`/${locale}`} aria-label="ContentArc" className={cn("flex items-center gap-2", className)}>
      <Image
        src="/brand/mark.png"
        alt=""
        width={194}
        height={222}
        priority
        className={size === "lg" ? "h-10 w-auto" : "h-8 w-auto"}
      />
      {/* The wordmark is a brand name: never translated, always left-to-right. */}
      <span dir="ltr" className={cn("font-display font-semibold tracking-tight", size === "lg" ? "text-2xl" : "text-xl")}>
        Content<span className="text-brand-gradient">Arc</span>
      </span>
    </Link>
  );
}
