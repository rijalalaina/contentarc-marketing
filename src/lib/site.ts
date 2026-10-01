// Single source of truth for the marketing site. Keep prices/limits in sync with the app
// (ContentArc/src/lib/plans.ts and the Stripe prices).

// Build-time overrides (e.g. local runs): NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_APP_URL.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://contentarc.app";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.contentarc.app";

export const SITE = {
  name: "ContentArc",
  url: SITE_URL,
  appUrl: APP_URL,
  signUpUrl: `${APP_URL}/login`,
  signInUrl: `${APP_URL}/login`,
  contactEmail: "support@contentarc.app",
} as const;

/** Legal operator of ContentArc (shown in the footer and on /privacy and /terms). */
export const LEGAL = {
  company: "Blissfulplan Publishing Ltd",
  jurisdiction: "England & Wales",
  companyNumber: "15418196",
  address: "Covent Garden, 71-75 Shelton Street, London, WC2H 9JQ, UK",
  companyEmail: "contact@blissfulplan.com",
  lastUpdated: "2026-10-01",
} as const;

export type Interval = "month" | "year";

export interface Plan {
  id: "free" | "creator" | "publisher" | "enterprise";
  prices: Record<Interval, number> | null; // USD, from Stripe
  campaigns: number;
  products: number | null; // null = unlimited
  rewrites: number;
  /** Brands that can auto-publish (one account per network each). null = unlimited. */
  publishingBrands: number | null;
  /** AI images per month. */
  images: number;
  prioritySupport?: boolean;
  popular?: boolean;
}

export const PIECES_PER_CAMPAIGN = 20;

export const PLANS: Plan[] = [
  {
    id: "free",
    prices: null,
    campaigns: 1,
    products: 1,
    rewrites: 10,
    publishingBrands: 0,
    images: 0,
  },
  {
    id: "creator",
    prices: { month: 19, year: 190 },
    campaigns: 10,
    products: 3,
    rewrites: 150,
    publishingBrands: 1,
    images: 150,
  },
  {
    id: "publisher",
    prices: { month: 49, year: 490 },
    campaigns: 30,
    products: 10,
    rewrites: 500,
    publishingBrands: 3,
    images: 450,
    popular: true,
  },
  {
    id: "enterprise",
    prices: { month: 149, year: 1490 },
    campaigns: 100,
    products: null,
    rewrites: 1500,
    publishingBrands: 10,
    images: 1500,
    prioritySupport: true,
  },
];

export const PLATFORMS = [
  { id: "youtube", count: 1 },
  { id: "short_video", count: 5 },
  { id: "linkedin", count: 3 },
  { id: "x_thread", count: 4 },
  { id: "carousel", count: 2 },
  { id: "story", count: 3 },
  { id: "newsletter", count: 2 },
] as const;

/** Main navigation: paths are locale-prefixed at render time, labels come from messages (common.nav). */
export const NAV = [
  { path: "/#how-it-works", key: "howItWorks" },
  { path: "/#features", key: "features" },
  { path: "/#pricing", key: "pricing" },
  { path: "/#faq", key: "faq" },
  { path: "/help", key: "help" },
] as const;
