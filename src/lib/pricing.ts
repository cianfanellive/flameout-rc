import type { Garment } from "./types";

// Tee blank options, two real print-on-demand blank brands, each with
// their own Printify blueprint/print-provider (see .env.example) and a
// different base price. Comfort Colors is a heavier, garment-dyed blank
// and costs more than Gildan's Heavy Cotton line.
export const TEE_BLANKS = {
  gildan: { label: "Gildan Heavy Cotton (5000)", priceCents: 2800 },
  comfort: { label: "Comfort Colors 1717", priceCents: 3600 },
} as const;

export type TeeBlank = keyof typeof TEE_BLANKS;

export const CAP_PRICE_CENTS = 2800;
export const EXTRA_SPONSOR_PRICE_CENTS = 500;
export const INCLUDED_SPONSORS = 5;
export const MAX_SPONSORS = 10;

export function basePriceCents(garment: Garment, blank: TeeBlank): number {
  return garment === "tee" ? TEE_BLANKS[blank].priceCents : CAP_PRICE_CENTS;
}

// The first INCLUDED_SPONSORS are part of the base price; each one after
// that, up to MAX_SPONSORS, is $5.
export function extraSponsorCount(sponsorCount: number): number {
  return Math.max(0, Math.min(sponsorCount, MAX_SPONSORS) - INCLUDED_SPONSORS);
}

export function totalPriceCents(
  garment: Garment,
  blank: TeeBlank,
  sponsorCount: number
): number {
  return (
    basePriceCents(garment, blank) +
    extraSponsorCount(sponsorCount) * EXTRA_SPONSOR_PRICE_CENTS
  );
}

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
