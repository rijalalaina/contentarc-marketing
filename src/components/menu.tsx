"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/** Small accessible dropdown: button + list, closes on outside click / Escape / selection. */
export function Menu({
  label,
  trigger,
  children,
  align = "end",
  className,
}: {
  label: string;
  trigger: React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: "start" | "end";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="text-fg hover:bg-bg-soft flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition-colors"
      >
        {trigger}
      </button>
      {open && (
        <div
          id={id}
          role="menu"
          className={cn(
            "border-border bg-card absolute top-full z-50 mt-1.5 min-w-44 rounded-xl border p-1 shadow-xl",
            align === "end" ? "end-0" : "start-0",
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export const menuItemClass =
  "hover:bg-bg-soft focus-visible:bg-bg-soft flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-start text-sm";
