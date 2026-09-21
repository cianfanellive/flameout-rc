"use client";

// Minimal client-side cart, backed by localStorage. There's no real
// checkout/payment behind this yet (see README), so this exists to give
// "Add to Cart" real behavior: items collect on the device, the cart page
// lists them, and submitting an order there is what actually calls
// /api/printify/create-product per item.
//
// Storing full sponsor logo images in every cart item can add up fast
// against localStorage's ~5MB-per-origin ceiling; fine for a demo cart,
// worth swapping for server-side storage before a real launch with many
// uploaded-logo orders.

import type { Garment } from "./types";
import type { ShirtColorId } from "@/components/GarmentMockup";
import type { SponsorItem } from "./livery";

export interface CartItem {
  id: string;
  garment: Garment;
  shirtColor: ShirtColorId;
  sponsors: SponsorItem[];
  primary: string;
  secondary: string;
  tertiary: string;
  fontId: string;
  driverName?: string;
  carNumber?: string;
  backColorMode: "same" | "custom";
  backPrimary?: string;
  backSecondary?: string;
  backTertiary?: string;
  size?: string;
  priceCents: number;
  frontPreview: string;
  createdAt: number;
}

const KEY = "flameoutrc-cart";
const EVENT = "flameoutrc-cart-change";

function safeParse(json: string | null): CartItem[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(window.localStorage.getItem(KEY));
  } catch {
    return [];
  }
}

function save(items: CartItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // storage full or unavailable (private window, etc.), cart just won't persist
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function addToCart(item: Omit<CartItem, "id" | "createdAt">): CartItem {
  const full: CartItem = { ...item, id: crypto.randomUUID(), createdAt: Date.now() };
  save([...getCart(), full]);
  return full;
}

export function removeFromCart(id: string) {
  save(getCart().filter((i) => i.id !== id));
}

export function clearCart() {
  save([]);
}

export function onCartChange(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
