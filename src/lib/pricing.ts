import type { Garment } from "./types";

// Tee blank options — two real print-on-demand blank brands, each with
// their own Printify blueprint/print-provider (see .env.example) and a
// different base price. Comfort Colors is a heavier, garment-dyed blank
// and costs more than Gildan's Heavy Cotton line.
export const TEE_BLANKS = {
  gildan: { label: "Gildan Heavy Cotton (5000)", priceCents: 2800 },
  comfort: { label: "Comfort Colors 1717", priceCents: 3600 },
} as const;

export type TeeBlank = keyof typeof TEE_BLANKS;

export const CAP_PRICE_CENTS = 2800;
export const EXTRA_BRAND_PRICE_CENTS = 500;
export const MAX_BRANDS = 5;

export function basePriceCents(garment: Garment, blank: TeeBlank): number {
  return garment === "tee" ? TEE_BLANKS[blank].priceCents : CAP_PRICE_CENTS;
}

// The first brand is included; each one after it (up to MAX_BRANDS) is $5.
export function extraBrandCount(brandCount: number): number {
  return Math.max(0, Math.min(brandCount, MAX_BRANDS) - 1);
}

export function totalPriceCents(
  garment: Garment,
  blank: TeeBlank,
  brandCount: number
): number {
  return (
    basePriceCents(garment, blank) +
    extraBrandCount(brandCount) * EXTRA_BRAND_PRICE_CENTS
  );
}

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
