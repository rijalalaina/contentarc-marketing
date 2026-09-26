"use client";

import { ThemeProvider } from "next-themes";

// Light / Dark / System, stored in localStorage and applied before paint (no flash).
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
