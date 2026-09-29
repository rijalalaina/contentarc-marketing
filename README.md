# ContentArc — marketing site (contentarc.app)

Static Next.js 16 site (landing, help, privacy, terms, contact) on **Cloudflare Pages**, with one
**Pages Function** (`functions/api/contact.ts`) that sends contact-form messages through Brevo.

```bash
npm install
npm run dev        # http://localhost:3000 (the contact form needs `npm run preview`)
npm run preview    # static build + Pages Functions locally (wrangler pages dev), http://localhost:8788
npm run deploy     # build + `wrangler pages deploy ./out`
```

## Deploy on Cloudflare Pages
1. Workers & Pages → Create → Pages → connect the `contentarc-marketing` repo (or use `npm run deploy`).
   - Build command: `npx next build` · Output directory: `out` · Node 20+.
2. Settings → Variables and secrets (Production):
   - `BREVO_API_KEY` (**secret**)
   - `CONTACT_TO_EMAIL`: inbox that receives messages (default `support@contentarc.app`; it needs a real inbox, e.g. Cloudflare Email Routing forwarding it to your mailbox)
   - `BREVO_SENDER_EMAIL`: a Brevo-verified sender / authenticated domain (default `noreply@contentarc.app`, authenticated in Brevo)
   - `BREVO_LIST_ID`: list for newsletter opt-ins (e.g. `14`)
   - Optional anti-spam: `TURNSTILE_SECRET_KEY` (secret) + build variable `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
3. Custom domains → add `contentarc.app` (and `www.contentarc.app`, redirected to the apex).

## Languages & theme
- 10 languages (en, fr, de, it, es, pt, zh, ru, ko, ar — Arabic is right-to-left), statically generated at `/{locale}/…`.
- All copy lives in `messages/{locale}.json`. `en.json` is the source of truth; every other file must have the same keys,
  placeholders (`{pieces}`, `{email}`…), rich tags (`<help>`, `<privacy>`…) and block structure.
- Bare URLs (`/`, `/help`, `/contact`, `/privacy`, `/terms`, `/pricing`, `/features`, `/faq`) are redirected to the visitor's
  language by the Pages Functions in `functions/` (saved `NEXT_LOCALE` cookie first, then `Accept-Language`, then English).
- Header toggles: language (keeps the current page) and theme (Light / Dark / System, remembered in localStorage).

## Content
- Prices, plan limits, formats, nav: `src/lib/site.ts` (keep in sync with the app's `src/lib/plans.ts` and Stripe).
- Legal operator: `LEGAL` in `src/lib/site.ts` — Blissfulplan Publishing Ltd (England & Wales, no. 15418196). Shown in the
  footer and on the privacy/terms pages. Translations of legal pages state that the English version prevails.
- Brand assets: `public/brand/` (derived from the app repo's `branding/` folder).
