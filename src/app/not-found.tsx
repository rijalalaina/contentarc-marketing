import Link from "next/link";
import { Inter, Poppins } from "next/font/google";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["600", "700"] });

export default function NotFound() {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <main className="glow mx-auto flex min-h-svh max-w-3xl flex-col items-center justify-center px-4 text-center">
          <p className="text-brand-gradient font-display text-7xl font-bold">404</p>
          <h1 className="mt-4 text-3xl font-semibold">This page doesn&apos;t exist</h1>
          <p className="text-muted mt-3">It may have moved, or the link might be mistyped.</p>
          <Link href="/" className="bg-brand-gradient mt-8 inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold text-white">
            Back to home
          </Link>
        </main>
      </body>
    </html>
  );
}
