# FlameoutRC

Custom RC-racing apparel, personalized by picking, not by an AI improvising: a customer picks
up to 10 sponsors (real RC brands from a dropdown, or their own uploaded logo), three colors,
and a font on the front, and an optional driver name/car number on the back, watches the
design update live on both sides, then adds it to a cart for a tee or snapback cap in their
pick of 5 shirt colors before it prints one-off through Printify. Same "personalize by
picking, print nothing until it's ordered" playbook as [OnPoint Graphix](https://opgfx.com/)
runs for team sportswear, applied to the RC hobby.

Next.js 15 / TypeScript / Tailwind, no database, this is a marketing site plus a design-and-
fulfillment flow, not a full storefront/checkout (see [What's stubbed](#whats-real-vs-stubbed)
below).

## The flow

1. **Landing page** (`/`): brand story, "how it works," and a livery gallery, all rendered
   from the same generator the design tool uses (`src/lib/livery.ts`).
2. **Designer** (`/design` for tees, `/design/cap` for caps): a single product-page layout, the
   garment mockup sits sticky on one side while every option lives in a panel on the other,
   updating the design live as you change anything. No steps, no "generate" button, no loading
   spinner, it's a pure client-side SVG render. A FRONT/BACK toggle switches the mockup between
   the sponsor print and the name-tag print.
   - **Garment color**: your pick of 5 shirt colors (`src/components/GarmentMockup.tsx`'s
     `SHIRT_COLORS`), shown on a real product photo where one's been shot, falling back to a
     flat illustration otherwise.
   - **Sponsors** (`src/lib/brands.ts`): up to 10, each one a real RC brand picked from a
     dropdown or a logo image uploaded from your device (PNG/JPG/WEBP, 1.5MB max). Uploaded
     logos get a colored frame that picks up the chosen palette. One sponsor renders as a big
     wordmark; 2+ render as a stacked sponsor-panel board, alternating colors per line, the
     same way a real RC pit-lane livery looks. This prints on the front.
   - **Colors, font**: three colors and one of 20 display fonts (`src/lib/fonts.ts`) with a
     live preview shown next to the picker, shared by both sides unless "New colors" is picked
     for the back.
   - **Back of shirt**: optional driver name and car number, jersey-style, with a toggle to
     either reuse the front's three colors or set a separate set for the back.
   - **Size guide**: an expandable Comfort Colors 1717 measurement chart next to the size
     picker (approximate, see the code comment).
3. **Add to cart** rasterizes the live design to a PNG (so the exact fonts/colors you see are
   what gets uploaded later) and stores the item in a localStorage cart (`src/lib/cart.ts`).
   The **cart page** (`/cart`) lists everything added and its own "Submit Order" button
   rasterizes and calls `/api/printify/create-product` (`src/lib/printify.ts`) per item, which
   creates a draft product in your Printify shop using the right blueprint/print-provider for
   the garment. Price is **recomputed server-side** from garment and sponsor count, never
   trusted from the client.

## Why it's not AI-generated

Earlier drafts of this piped the design through an image-generation model. This version
doesn't, the "livery" is deterministic layout and typography (`src/lib/livery.ts`): sponsors
and a name tag set directly in real display fonts, transparent everywhere else so it reads as
ink on fabric rather than a printed sticker. It's cheaper to run (no per-generation API cost),
instant (no generation latency), and safer to sell (see the trademark note below).

## Local dev

```bash
npm install
npm run dev
```

**You don't need any API keys to try the whole flow.** The design step and cart are 100%
local/client side. Only "Submit Order" on the cart page needs real Printify credentials,
without them it returns a stub showing exactly what payload *would* have been sent, flagged
`stubbed: true` and surfaced in the UI as a small banner.

## Wiring up real Printify orders

You need, per garment you want to actually create:

1. An API token and shop id from your Printify account (`PRINTIFY_API_KEY`, `PRINTIFY_SHOP_ID`).
2. A blueprint and print provider pair for each of the two sellable garments, pick one in the
   [Printify catalog](https://developers.printify.com/#catalog) (Comfort Colors 1717 for the
   tee, a Yupoong 6089M or similar for the cap, a provider that carries all 5 shirt colors)
   and note both IDs into the matching vars in `.env.example`.

Creating the product is **not** the same as being able to sell it. Printify still needs a
connected sales channel (Shopify, Etsy, WooCommerce, or its own Pop-Up Store) before a customer
can actually check out. This project stops at "draft product created in your Printify shop";
wire up a channel as a next step.

## What's real vs. stubbed

- **Real**: the landing page, the live client-side design generator (sponsors, colors, font,
  back name tag), the localStorage cart, the client-side PNG rasterization before upload, the
  pricing math (base price plus $5 per sponsor past the first 5, recomputed server-side), and
  the three-call Printify product-creation sequence (upload artwork, look up variant ids,
  create product).
- **Stubbed / not attempted** (no accounts available to this build):
  - Actual Printify API key/shop setup, needs your account.
  - Checkout, Printify doesn't take payment itself; you need a connected storefront. Not
    chosen or wired up here.
  - Persisting orders/designs anywhere (no database yet), a design only lives in the browser
    tab until you send it to Printify.
  - Auth/accounts, order history, email confirmations.
  - Domain purchase, trademark clearance for the "FlameoutRC" name.

## A note on trademarks

The sponsor picker (`src/lib/brands.ts`) lists real RC manufacturer names, Traxxas, Team
Associated, ARRMA, and so on, because that's the point: a customer's shirt should say what rig
they run. Customers can also upload their own logo directly, which raises the same question
from the other direction (make sure it's a logo they actually have rights to use). Two things
keep the brand-name path from being a straightforward reproduction of someone else's trademark:
the names are always rendered in this site's own display typography, never as copied logo
artwork, and every page carries a visible "not affiliated with or endorsed by" disclaimer. That
said, using a manufacturer's name commercially on merchandise is still a real trademark
question, nominative use (naming whose product something is compatible with) is a recognized
defense, but it isn't a blanket pass, and it varies by jurisdiction. **Get an actual legal read
before a real commercial launch**, especially before printing anything beyond plain brand-name
typography, and consider what review process (if any) uploaded logos need before they go to
print.

## Deploying

No database, so this deploys anywhere Next.js does:

- **Vercel**: simplest, `next build` works as-is out of the box.
- **Cloudflare Pages**: free, via GitHub Actions. See [`DEPLOY.md`](./DEPLOY.md) for the exact
  one-time commands; the one API route already declares `export const runtime = "edge"` as
  `@cloudflare/next-on-pages` requires.

Either way, set the Printify env vars from `.env.example` on the host before you flip on real
order creation.
