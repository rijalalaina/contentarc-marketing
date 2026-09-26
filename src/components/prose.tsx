import { cn } from "@/lib/cn";

/** Long-form text layout for help and legal pages (no typography plugin needed). */
export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "text-[1.02rem] leading-relaxed",
        "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold",
        "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold",
        "[&_p]:text-muted [&_p]:my-4 [&_li]:text-muted [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
        "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_strong]:text-fg [&_strong]:font-semibold",
        "[&_a]:text-violet [&_a]:underline [&_a]:underline-offset-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHero({
  title,
  intro,
  meta,
  wide = false,
}: {
  title: string;
  intro?: React.ReactNode;
  meta?: string;
  /** Match pages whose content uses the full 6xl width. */
  wide?: boolean;
}) {
  return (
    <header className="glow">
      <div className={cn("mx-auto px-4 pt-16 pb-10 sm:px-6", wide ? "max-w-6xl" : "max-w-3xl")}>
        <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
        {intro && <p className="text-muted mt-4 text-lg">{intro}</p>}
        {meta && <p className="text-muted mt-3 text-sm">{meta}</p>}
      </div>
    </header>
  );
}
