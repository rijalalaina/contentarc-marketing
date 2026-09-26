import { cn } from "@/lib/cn";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={cn("mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24", className)}>
      <div className="mx-auto mb-12 max-w-2xl text-center">
        {eyebrow && <p className="text-violet mb-3 text-sm font-semibold tracking-wide uppercase">{eyebrow}</p>}
        <h2 id={id ? `${id}-title` : undefined} className="text-3xl font-semibold sm:text-4xl">
          {title}
        </h2>
        {intro && <p className="text-muted mt-4 text-lg">{intro}</p>}
      </div>
      {children}
    </section>
  );
}
