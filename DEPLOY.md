# Deploying to Cloudflare Pages (free, via GitHub Actions)

You need to run these yourself — I can't log into your Cloudflare or GitHub accounts or claim a
subdomain on your behalf. Everything below is copy-paste, one time only.

## 0. One-time Cloudflare login

```bash
npm install
npx wrangler login
```

Opens a browser tab to authorize the Wrangler CLI against your Cloudflare account.

## 1. The Pages project

`.github/workflows/deploy.yml` creates the `flameout-rc` Pages project automatically on its
first run if it doesn't exist yet — nothing to do here unless you want a different project
name. If you do, create it yourself first:

```bash
npx wrangler pages project create <your-name> --production-branch=main
```

Then update `name` in `wrangler.toml`, the `create`/`projectName:` lines in
`.github/workflows/deploy.yml`, and `--project-name` in `package.json`'s
`cf:deploy`/`cf:preview` scripts to match.

## 2. Push this project to GitHub

Already done if you're reading this from the repo — otherwise:

```bash
git add -A
git commit -m "Cloudflare Pages deploy via GitHub Actions"
git remote add origin <your-repo-url>
git push -u origin main
```

## 3. Add two repo secrets on GitHub

On the repo page → **Settings → Secrets and variables → Actions → New repository secret**:

- `CLOUDFLARE_API_TOKEN` — Cloudflare dashboard → My Profile → API Tokens → Create Token →
  the "Edit Cloudflare Workers" template (covers Pages).
- `CLOUDFLARE_ACCOUNT_ID` — shown in the Cloudflare dashboard sidebar on any zone, or run
  `npx wrangler whoami`.

## 4. Deploy

Push to `main` (or re-run step 2's commit/push) and GitHub Actions
(`.github/workflows/deploy.yml`) builds and deploys automatically — watch it under the repo's
**Actions** tab. You can also trigger it manually from that tab ("Run workflow") without a new
commit. Cloudflare gives you a free `https://flameout-rc.pages.dev`-style URL — no domain
purchase required.

## 5. Turn on real Printify order creation (optional, any time later)

The site is fully browsable and the whole design flow works in **demo mode** with none of this
— the design step is 100% client-side already (see README.md); this just switches the "Send to
Printify" stub over to actually creating the product. Set each one you have as a Pages secret:

```bash
npx wrangler pages secret put PRINTIFY_API_KEY --project-name=flameout-rc
npx wrangler pages secret put PRINTIFY_SHOP_ID --project-name=flameout-rc
npx wrangler pages secret put PRINTIFY_TSHIRT_GILDAN_BLUEPRINT_ID --project-name=flameout-rc
npx wrangler pages secret put PRINTIFY_TSHIRT_GILDAN_PRINT_PROVIDER_ID --project-name=flameout-rc
npx wrangler pages secret put PRINTIFY_TSHIRT_COMFORT_BLUEPRINT_ID --project-name=flameout-rc
npx wrangler pages secret put PRINTIFY_TSHIRT_COMFORT_PRINT_PROVIDER_ID --project-name=flameout-rc
npx wrangler pages secret put PRINTIFY_CAP_BLUEPRINT_ID --project-name=flameout-rc
npx wrangler pages secret put PRINTIFY_CAP_PRINT_PROVIDER_ID --project-name=flameout-rc
```

(See `README.md` for where each Printify ID comes from.) Secrets take effect on the next
deploy — push any commit, or re-run the Action from the **Actions** tab.

## 6. (Optional) Attach a real custom domain later

If you buy a domain for this brand, Cloudflare Pages → your project → **Custom domains** lets
you attach it for free — Cloudflare doesn't charge to connect a domain you already own, only the
registrar charges for the domain itself. Until then, the `.pages.dev` subdomain is the free,
fully-working public URL.

## What makes this Cloudflare-compatible

- The one API route (`/api/printify/create-product`) declares `export const runtime = "edge"`,
  which `@cloudflare/next-on-pages` requires — Cloudflare Pages Functions run on Workers, not
  Node. The design generator itself runs client-side, so there's no route for it at all.
- No database or file storage, so there's nothing to provision beyond the Pages project itself.
- `.github/workflows/deploy.yml` runs the build on Ubuntu via GitHub Actions rather than
  depending on your local machine.

## Verifying it worked

1. Visit your `.pages.dev` URL — the homepage and livery gallery should render.
2. Go to `/design`, pick brands/colors/style (the preview updates live), continue to step 2,
   and click "Send to Printify" (shows the demo-mode stub unless you've set the Printify
   secrets).
