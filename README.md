# FlameoutRC

Custom RC-racing apparel, personalized by picking — not by an AI improvising: a customer
chooses up to 5 real RC brands, a primary/secondary color, and a livery style, watches the
design update live, then sees it on a tee or snapback cap before it prints one-off through
Printify. Same "personalize by picking, print nothing until it's ordered" playbook as
[OnPoint Graphix](https://opgfx.com/) runs for team sportswear, applied to the RC hobby.

Next.js 15 / TypeScript / Tailwind, no database — this is a marketing site + a design-and-
fulfillment flow, not a full storefront/checkout (see [What's stubbed](#whats-real-vs-stubbed)
below).

## The flow

1. **Landing page** (`/`) — brand story, "how it works," and a livery gallery, all rendered
   from the same generator the design tool uses (`src/lib/livery.ts`).
2. **Designer, step 1** (`/design`) — customer picks garment (tee/cap), a tee blank (Gildan
   Heavy Cotton or Comfort Colors — different price), RC discipline, up to 5 RC brands
   (`src/lib/brands.ts`), two colors, and a design style. The design preview updates
   **instantly** — it's a pure client-side SVG render (`liverySvgDataUri`), no server round
   trip, no AI call, no loading spinner.
3. **Designer, step 2** — the same design shown on a full tee/cap mockup, with a live price
   breakdown (`src/lib/pricing.ts`): base price for the chosen blank/garment, plus $5 per RC
   brand past the first.
4. **"Send to Printify"** calls `/api/printify/create-product` (`src/lib/printify.ts`), which
   uploads the artwork and creates a draft product in your Printify shop — the right
   blueprint/print-provider for the garment+blank combo chosen. Price is **recomputed
   server-side** from garment/blank/brand-count, never trusted from the client.

## Why it's not AI-generated

Earlier drafts of this piped the design through an image-generation model. This version
doesn't — the "livery" is deterministic layout + typography (`src/lib/livery.ts`): checkered
corners, carbon plate, neon lines, flame glow, or retro stripes as a background, with the
brand name(s) set in a bold display face on top. One brand renders as a big centered wordmark;
2-5 renders as a stacked sponsor-panel board, alternating colors per line — which is also just
what a real RC pit-lane livery looks like. It's cheaper to run (no per-generation API cost),
instant (no generation latency), and safer to sell (see the trademark note below).

## Local dev

```bash
npm install
npm run dev
```

**You don't need any API keys to try the whole flow.** The design step is 100% local/client-
side. Only "Send to Printify" needs real credentials — without them it returns a stub showing
exactly what payload *would* have been sent, flagged `stubbed: true` and surfaced in the UI as
a small banner.

## Wiring up real Printify orders

You need, per garment you want to actually create:

1. An API token and shop id from your Printify account (`PRINTIFY_API_KEY`, `PRINTIFY_SHOP_ID`).
2. A blueprint + print provider pair for each of the three sellable garments — pick one in the
   [Printify catalog](https://developers.printify.com/#catalog) (e.g. Gildan 5000 for the
   Gildan tee option, Comfort Colors 1717 for the other tee option, a Yupoong 6089M for the
   cap) and note both IDs into the matching vars in `.env.example`.

Creating the product is **not** the same as being able to sell it — Printify still needs a
connected sales channel (Shopify, Etsy, WooCommerce, or its own Pop-Up Store) before a customer
can actually check out. This project stops at "draft product created in your Printify shop";
wire up a channel as a next step.

## What's real vs. stubbed

- **Real**: the landing page, the two-step customizer, the live client-side design generator,
  the pricing math (base price by blank + $5/extra brand, recomputed server-side), and the
  three-call Printify product-creation sequence (upload artwork → look up variant ids → create
  product).
- **Stubbed / not attempted** (no accounts available to this build):
  - Actual Printify API key/shop setup — needs your account.
  - Checkout — Printify doesn't take payment itself; you need a connected storefront. Not
    chosen or wired up here.
  - Persisting orders/designs anywhere (no database yet) — a design only lives in the browser
    tab until you send it to Printify.
  - Auth/accounts, order history, email confirmations.
  - Domain purchase, trademark clearance for the "FlameoutRC" name.

## A note on trademarks

The brand picker (`src/lib/brands.ts`) lists real RC manufacturer names — Traxxas, Team
Associated, ARRMA, and so on — because that's the point: a customer's shirt should say what
rig they run. Two things keep that from being a straightforward reproduction of someone else's
trademark: the names are always rendered in this site's own display typography, and never as
copied logo artwork, and every page carries a visible "not affiliated with or endorsed by"
disclaimer. That said, using a manufacturer's name commercially on merchandise is still a real
trademark question — nominative use (naming whose product something is compatible with/for) is
a recognized defense, but it isn't a blanket pass, and it varies by jurisdiction. **Get an
actual legal read before a real commercial launch**, especially before printing anything beyond
plain brand-name typography.

## Deploying

No database, so this deploys anywhere Next.js does:

- **Vercel** — simplest, `next build` works as-is out of the box.
- **Cloudflare Pages** — free, via GitHub Actions. See [`DEPLOY.md`](./DEPLOY.md) for the exact
  one-time commands; both API routes already declare `export const runtime = "edge"` as
  `@cloudflare/next-on-pages` requires.

Either way, set the Printify env vars from `.env.example` on the host before you flip on real
order creation.
