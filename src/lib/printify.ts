import { basePriceCents, extraSponsorCount, EXTRA_SPONSOR_PRICE_CENTS, totalPriceCents } from "./pricing";
import type { Garment, PrintifyCreateResult } from "./types";

const API = "https://api.printify.com/v1";

interface GarmentConfig {
  blueprintId?: string;
  printProviderId?: string;
  label: string;
}

// Each sellable garment (Comfort Colors tee, or cap) is its own Printify
// blueprint/print-provider pair. See .env.example for where these IDs
// come from.
function garmentConfig(garment: Garment): GarmentConfig {
  if (garment === "cap") {
    return {
      blueprintId: process.env.PRINTIFY_CAP_BLUEPRINT_ID,
      printProviderId: process.env.PRINTIFY_CAP_PRINT_PROVIDER_ID,
      label: "Snapback Cap",
    };
  }
  return {
    blueprintId: process.env.PRINTIFY_TSHIRT_COMFORT_BLUEPRINT_ID,
    printProviderId: process.env.PRINTIFY_TSHIRT_COMFORT_PRINT_PROVIDER_ID,
    label: "Tee, Comfort Colors 1717",
  };
}

async function printifyFetch(path: string, apiKey: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Printify ${path} returned ${res.status}: ${body.slice(0, 400)}`);
  }
  return res.json();
}

/**
 * Uploads the generated artwork and creates a draft product in the
 * configured Printify shop. See .env.example for the env vars this needs,
 * any missing one (including the shop-wide API key/shop id) makes this
 * resolve to a stub describing exactly what *would* have been sent, so the
 * "Send to Printify" button in the UI always has something to show.
 *
 * Price is always recomputed here from garment and sponsor count, never
 * trusted from the client, so a tampered request can't undercut the real
 * price.
 *
 * Real-integration notes (printify.com/docs/api):
 *  - POST /v1/uploads/images.json            uploads artwork, returns an image id
 *  - GET  /v1/catalog/.../variants.json      looks up sellable variant ids
 *  - POST /v1/shops/{shop_id}/products.json  creates the product
 * This does not publish to a sales channel. Printify still needs a
 * connected storefront (Shopify, Etsy, etc, or its own Pop-Up Store) for
 * customers to actually check out.
 */
export async function createPrintifyProduct(input: {
  garment: Garment;
  sponsorCount: number;
  sponsorLabels: string[];
  shirtColor?: string;
  size?: string;
  title: string;
  imageDataUrl: string;
}): Promise<PrintifyCreateResult> {
  const apiKey = process.env.PRINTIFY_API_KEY;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  const cfg = garmentConfig(input.garment);

  const base = basePriceCents(input.garment);
  const extras = extraSponsorCount(input.sponsorCount);
  const price = totalPriceCents(input.garment, input.sponsorCount);

  const wouldCreate = {
    title: input.title,
    garment: cfg.label,
    color: input.shirtColor ?? "(any)",
    size: input.size ?? "(any)",
    blueprint_id: cfg.blueprintId ?? "(not configured)",
    print_provider_id: cfg.printProviderId ?? "(not configured)",
    base_price_cents: base,
    extra_sponsor_fee_cents: extras * EXTRA_SPONSOR_PRICE_CENTS,
    total_price_cents: price,
  };

  if (!apiKey || !shopId || !cfg.blueprintId || !cfg.printProviderId) {
    return {
      stubbed: true,
      note: "Demo mode. Set PRINTIFY_API_KEY, PRINTIFY_SHOP_ID, and this garment's blueprint/print-provider IDs in .env to actually create this product in Printify.",
      wouldCreate,
    };
  }

  try {
    const base64 = input.imageDataUrl.split(",")[1] ?? "";
    const upload = (await printifyFetch("/uploads/images.json", apiKey, {
      method: "POST",
      body: JSON.stringify({
        file_name: `${input.title.replace(/\s+/g, "-").toLowerCase()}.png`,
        contents: base64,
      }),
    })) as { id: string };

    const variants = (await printifyFetch(
      `/catalog/blueprints/${cfg.blueprintId}/print_providers/${cfg.printProviderId}/variants.json`,
      apiKey
    )) as { variants: Array<{ id: number; title?: string }> };

    // Best-effort: if a shirt color was picked, only include variants whose
    // title mentions it (Printify variant titles are usually "Color / Size").
    // Falls back to every variant if nothing matches, so this never zeroes
    // out the product over a naming mismatch.
    const colorFiltered = input.shirtColor
      ? variants.variants.filter((v) => v.title?.toLowerCase().includes(input.shirtColor!.toLowerCase()))
      : variants.variants;
    const variantIds = (colorFiltered.length ? colorFiltered : variants.variants).map((v) => v.id);
    if (variantIds.length === 0) throw new Error("No variants returned for this blueprint/provider");

    const product = (await printifyFetch(`/shops/${shopId}/products.json`, apiKey, {
      method: "POST",
      body: JSON.stringify({
        title: input.title,
        description: `Custom ${cfg.label.toLowerCase()}. Sponsors: ${input.sponsorLabels.join(", ")}. Generated by FlameoutRC.`,
        blueprint_id: Number(cfg.blueprintId),
        print_provider_id: Number(cfg.printProviderId),
        variants: variantIds.map((id) => ({ id, price, is_enabled: true })),
        print_areas: [
          {
            variant_ids: variantIds,
            placeholders: [
              {
                position: "front",
                images: [{ id: upload.id, x: 0.5, y: 0.5, scale: 1, angle: 0 }],
              },
            ],
          },
        ],
      }),
    })) as { id: string };

    return {
      stubbed: false,
      productId: product.id,
      note: "Created as a draft product in your Printify shop. Publish it to a connected sales channel (Shopify, Etsy, or a Printify Pop-Up Store) to let customers check out.",
    };
  } catch (err) {
    return {
      stubbed: true,
      note: `Printify request failed, nothing was created: ${
        err instanceof Error ? err.message : String(err)
      }`,
      wouldCreate,
    };
  }
}
