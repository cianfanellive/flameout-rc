# FlameoutRC

Custom RC-racing apparel, personalized per customer: tell us your rig, your
colors, and your discipline, and an AI-generated livery graphic gets printed
one-off on a tee or snapback cap through print-on-demand. Same playbook as
sites like [OnPoint Graphix](https://opgfx.com/) run for team sportswear —
personalize by description, print nothing until it's ordered — applied to
the RC hobby instead of school sports.

Next.js 15 / TypeScript / Tailwind, no database — this is a marketing site +
a design-and-fulfillment flow, not a full storefront/checkout (see
[What's stubbed](#whats-real-vs-stubbed) below).

## The flow

1. **Landing page** (`/`) — brand story, "how it works," and a livery
   gallery, all rendered from the same SVG livery generator the design tool
   uses (`src/lib/livery.ts`), so the gallery always matches what a real
   generation looks like.
2. **Designer** (`/design`) — customer picks garment (tee/cap), RC
   discipline, rig brand/model, two colors, a design style, and optional
   extra direction. "Generate Design" calls `/api/generate-design`.
3. **`/api/generate-design`** builds a prompt (`src/lib/prompt.ts`) and calls
   OpenAI's Images API (`gpt-image-1`) to produce a print-ready, transparent-
   background graphic (`src/lib/openai.ts`).
4. **"Send to Printify"** calls `/api/printify/create-product`
   (`src/lib/printify.ts`), which uploads the artwork and creates a draft
   product in your Printify shop (tee or cap, per the blueprint/print
   provider you've configured).

## Local dev

```bash
npm install
cp .env.example .env.local   # optional — see below
npm run dev
```

**You don't need any API keys to try the whole flow.** Without
`OPENAI_API_KEY`, design generation falls back to a locally-built placeholder
graphic in the chosen colors/style (`src/lib/livery.ts`) — same visual
language as the gallery, just not AI-improvised. Without the Printify
env vars, "Send to Printify" returns a stub showing exactly what payload
*would* have been sent. Every response carries a `stubbed: true` flag the
UI surfaces as a small banner, so it's always obvious which mode you're in.

## Wiring up the real integrations

**OpenAI** — set `OPENAI_API_KEY` (needs Images API / `gpt-image-1` access).
That's the only step; `lib/openai.ts` switches from placeholder to real
generation automatically.

**Printify** — you need, per garment you want to actually create:

1. An API token and shop id from your Printify account
   (`PRINTIFY_API_KEY`, `PRINTIFY_SHOP_ID`).
2. A blueprint + print provider pair for that garment — pick one in the
   [Printify catalog](https://developers.printify.com/#catalog) (e.g. a
   Bella+Canvas 3001 tee, a Yupoong 6089M cap) and note both IDs into
   `PRINTIFY_TSHIRT_BLUEPRINT_ID` / `PRINTIFY_TSHIRT_PRINT_PROVIDER_ID` (and
   the `_CAP_` equivalents).

Creating the product is **not** the same as being able to sell it — Printify
still needs a connected sales channel (Shopify, Etsy, WooCommerce, or its
own Pop-Up Store) before a customer can actually check out. This project
stops at "draft product created in your Printify shop"; wire up a channel
(and, if you want it on this domain, embed or link to it) as a next step.

## What's real vs. stubbed

- **Real**: the landing page, the customizer UI, prompt construction, the
  OpenAI Images call, and the three-call Printify product-creation sequence
  (upload artwork → look up variant ids → create product).
- **Stubbed / not attempted** (no accounts available to this build):
  - Actual OpenAI and Printify API keys/shop setup — needs your accounts.
  - Checkout — Printify doesn't take payment itself; you need a connected
    storefront. Not chosen or wired up here.
  - Persisting orders/designs anywhere (no database yet) — a generated
    design only lives in the browser tab until you send it to Printify.
  - Auth/accounts, order history, email confirmations.
  - Domain purchase, trademark clearance for the "FlameoutRC" name.

## A note on trademarks

Customers type in real RC manufacturer/model names ("Traxxas Slash," "Team
Associated RC10," etc.) to personalize their design — same idea as putting a
name and number on a jersey. The prompt sent to the image model
(`src/lib/prompt.ts`) explicitly instructs it to build **original** livery
art inspired by that input, not to reproduce a manufacturer's actual logo or
an existing team's registered livery. Worth a proper legal read before a
real commercial launch, especially if you ever let customers upload their
own reference images.

## Deploying

No database, so this deploys anywhere Next.js does:

- **Vercel** — simplest, `next build` works as-is out of the box.
- **Cloudflare Pages** — `npm run cf:build` / `cf:deploy` are wired up
  (mirrors the sibling `ExtremeRC`/`PortalBrasilTeam`/`forthechildrencostarica`
  projects), no D1/R2 needed since there's no database.

Either way, set the env vars from `.env.example` on the host before you flip
on real OpenAI/Printify calls.
