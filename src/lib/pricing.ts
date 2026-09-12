import type { Garment } from "./types";

// Comfort Colors 1717 is the only tee blank this store sells (no more
// Gildan option, per direction) — a heavier, garment-dyed tee.
export const TEE_PRICE_CENTS = 3600;
export const TEE_BLANK_LABEL = "Comfort Colors 1717";

export const CAP_PRICE_CENTS = 2800;
export const EXTRA_SPONSOR_PRICE_CENTS = 500;
export const INCLUDED_SPONSORS = 5;
export const MAX_SPONSORS = 10;

export function basePriceCents(garment: Garment): number {
  return garment === "tee" ? TEE_PRICE_CENTS : CAP_PRICE_CENTS;
}

// The first INCLUDED_SPONSORS are part of the base price; each one after
// that, up to MAX_SPONSORS, is $5.
export function extraSponsorCount(sponsorCount: number): number {
  return Math.max(0, Math.min(sponsorCount, MAX_SPONSORS) - INCLUDED_SPONSORS);
}

export function totalPriceCents(garment: Garment, sponsorCount: number): number {
  return basePriceCents(garment) + extraSponsorCount(sponsorCount) * EXTRA_SPONSOR_PRICE_CENTS;
}

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
