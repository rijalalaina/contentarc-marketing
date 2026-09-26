import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Fully static site for Cloudflare Pages: /{locale}/… pages. The Pages Functions in /functions handle
// language detection for bare URLs and the contact form.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default withNextIntl(nextConfig);
