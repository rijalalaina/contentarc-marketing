import { ChevronDownIcon } from "lucide-react";

export interface FaqItem {
  q: string;
  a: React.ReactNode;
}

/** Native <details> accordion: accessible, no JS required. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-border bg-card divide-border divide-y rounded-2xl border">
      {items.map((item) => (
        <details key={item.q} className="group px-5 py-1 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDownIcon aria-hidden className="text-muted size-5 shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <div className="text-muted space-y-3 pb-5 text-[0.95rem] leading-relaxed">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
