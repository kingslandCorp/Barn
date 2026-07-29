# The Barn — Kingsland Barn

A premium, mobile-first website for The Barn (Kingsland Barn), a luxury countryside
holiday let in the Vale of Glamorgan, Wales. Built with Next.js 15 (App Router),
TypeScript, Tailwind CSS and Framer Motion, and configured to export as a fully static
site that GitHub Pages can host for free.

## Pages

| Page | Route | Notes |
|---|---|---|
| Home | `/` | Hero, warm welcome, stay highlights, gallery, area teaser |
| Directions | `/directions` | Arrival steps, map, what3words, parking, arriving after dark |
| Explore the Area | `/explore` | Coast & beaches, food & drink, towns & villages, family activities |
| Before You Leave | `/before-you-leave` | Interactive departure checklist |
| Guests | `/guests` | **Email-gated** house rules and pool safety information |

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

If `npm install` complains about peer dependencies (this can happen with React 19 and
some Framer Motion versions), run:

```bash
npm install --legacy-peer-deps
```

## Before you launch — things to check or replace

Real property photography is now built in (see "Photography" below) — the two things
still specific to the exact property are the map location and the what3words address:

1. **Map.** `mapEmbedSrc` in `src/lib/content.ts` currently points to a generic
   "Llanmaes, Vale of Glamorgan" search. Replace it with an embed URL for the exact
   address (Google Maps → Share → Embed a map → copy the `src`).
2. **what3words.** `what3words` in `src/lib/content.ts` is a placeholder
   (`///example.words.here`). Replace `words` and `url` with the real address for the
   entrance.
3. **Domain.** `siteUrl` in `src/app/layout.tsx` and the URLs in
   `public/robots.txt` / `public/sitemap.xml` currently use `https://kingsland.co.uk` —
   update all three if the real domain differs.
4. **Contact email.** Everything reads from `siteConfig.email` in
   `src/lib/content.ts` (currently `Hello@Kingsland.co.uk`) — change it in one place if
   needed.

## Photography

All photos are real, guest-supplied images of the actual property, resized and
compressed for the web (see `public/images/`). They're wired up in two places:

- **`sitePhotos`** in `src/lib/content.ts` — the single "hero" style photos used once
  each: the homepage hero, the "Warm Welcome" section, "Discover the Vale", the
  directions track photo, the after-dark arrival photo, and the pool-safety photo.
- **`galleryItems`** in `src/lib/content.ts` — the homepage gallery grid. Each entry
  needs its real pixel `width`/`height` so the layout can reserve the correct aspect
  ratio without a layout shift.

Both render through `src/components/Photo.tsx`, a small wrapper around `next/image`
that keeps the site's rounded-card, gradient-caption look. To swap or add a photo:
drop the file in `public/images/`, then point a `sitePhotos` or `galleryItems` entry at
it with its real width/height.

The **Explore the Area** page (Southerndown Beach, Nash Point, Cowbridge, etc.) still
uses the soft colour-gradient placeholders from the original design — no photos of
those specific locations were supplied. Add real ones the same way if you have them
(`src/components/AreaCard.tsx` reads from `src/lib/content.ts`'s `exploreCategories`).

## Editing copy

Nearly all text content — stay highlights, gallery captions, arrival steps, area guide
entries, house rules, pool rules, and the departure checklist — lives in
`src/lib/content.ts`. Edit it there rather than hunting through page/component files.

## The Guests section — how the login works, and its limits

`/guests` asks for an email address before showing house rules and pool safety
information. Please go in with the right expectations about what this is:

- **This is a static website with no server or database**, so there is nothing to check
  the email address against — anyone who enters *any* validly formatted email address is
  let in, and the choice is remembered in that browser's `localStorage` so they aren't
  asked again on return visits (there's a "Sign out" link in `src/components/GuestArea.tsx`
  to reset it).
- Its purpose is to make sure casual visitors and search engines don't stumble onto pool
  safety rules on the homepage nav — it is a courtesy gate, **not real access control**.
  It won't stop someone determined from viewing the page source or reading the compiled
  JavaScript, and it doesn't verify the email belongs to an actual guest.
- `/guests` is excluded from `robots.txt` and the sitemap so it won't be indexed by
  search engines.

If you need genuine guest-only access (e.g. verified against a real booking system),
that requires a backend — options include a small serverless function (Vercel/Netlify/
Cloudflare Workers) that checks the email against your booking platform, or a proper
auth provider. That's a bigger job than a static GitHub Pages site can do on its own,
but happy to help scope it out if it becomes a priority.

## Deploying to GitHub Pages

A ready-made workflow lives at `.github/workflows/deploy.yml`. Steps:

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages → Build and deployment → Source**, and choose
   **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab). It will build
   the site with `next build` (static export) and publish the `out/` folder.

**One setting to check:** the workflow automatically sets the site's base path to
`/<repo-name>/`, which is correct if your site will live at
`https://<username>.github.io/<repo-name>/`. If instead you're using:

- a repo named `<username>.github.io` (a root user/org site), or
- a custom domain (via a `CNAME` file in `public/`),

then open `.github/workflows/deploy.yml` and delete the "Set base path for project
pages" step, since the site should be served from `/` in both of those cases.

*(Small cosmetic note: on a project-page deployment under a sub-path, the browser tab
favicon may not pick up the sub-path prefix. It's a one-line fix if it comes up —
everything else on the site, including all navigation, is basePath-aware already.)*

## Tech

- **Next.js 15** (App Router, static export via `output: 'export'`)
- **TypeScript**, **Tailwind CSS**, **Framer Motion**
- **lucide-react** for icons
- SEO: per-page metadata, Open Graph + Twitter cards, `LodgingBusiness` JSON-LD structured
  data, `robots.txt`, `sitemap.xml`
- Accessibility: visible keyboard focus states, `prefers-reduced-motion` respected
  throughout (see `src/app/globals.css` and `src/components/Hero.tsx`)
