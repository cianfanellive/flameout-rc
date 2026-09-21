"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SHIRT_COLORS } from "@/components/GarmentMockup";
import { clearCart, getCart, onCartChange, removeFromCart, type CartItem } from "@/lib/cart";
import { formatUsd } from "@/lib/pricing";

interface SubmitResult {
  stubbed: boolean;
  note: string;
  productId?: string;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<Record<string, SubmitResult>>({});

  useEffect(() => {
    setItems(getCart());
    return onCartChange(() => setItems(getCart()));
  }, []);

  const total = items.reduce((sum, i) => sum + i.priceCents, 0);

  function sponsorNames(item: CartItem) {
    return item.sponsors.map((s) => (s.kind === "text" ? s.label : "Uploaded logo")).join(", ");
  }

  async function handleSubmitOrder() {
    setSubmitting(true);
    const next: Record<string, SubmitResult> = {};
    for (const item of items) {
      try {
        const sponsorLabels = item.sponsors.map((s, i) => (s.kind === "text" ? s.label : `Logo ${i + 1}`));
        const res = await fetch("/api/printify/create-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            garment: item.garment,
            shirtColor: SHIRT_COLORS[item.shirtColor].label,
            size: item.size,
            sponsorCount: item.sponsors.length,
            sponsorLabels,
            title: `${sponsorLabels.join(" x ")} livery`,
            imageDataUrl: item.frontPreview,
          }),
        });
        const data = await res.json();
        next[item.id] = res.ok ? data : { stubbed: true, note: data.error ?? "Request failed" };
      } catch (err) {
        next[item.id] = { stubbed: true, note: err instanceof Error ? err.message : "Request failed" };
      }
    }
    setResults(next);
    setSubmitting(false);
  }

  return (
    <>
      <Nav />
      <main className="asphalt-texture min-h-[60vh] bg-asphalt-950 py-12">
        <div className="mx-auto max-w-4xl px-5">
          <span className="font-display text-xs uppercase tracking-[0.2em] text-flame-500">YOUR CART</span>
          <h1 className="mt-2 font-display text-4xl uppercase tracking-tight text-chrome-300">CART</h1>

          {items.length === 0 ? (
            <div className="mt-8 rounded-md border border-white/10 bg-asphalt-800 p-8 text-center">
              <p className="text-chrome-400">Your cart is empty.</p>
              <Link
                href="/design"
                className="mt-4 inline-block rounded-sm bg-flame-500 px-6 py-3 font-display text-sm uppercase tracking-wider text-asphalt-950 shadow-glow transition hover:bg-flame-400"
              >
                START A DESIGN →
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-md border border-white/10 bg-asphalt-800 p-4 shadow-panel sm:flex-row sm:items-center"
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-sm bg-asphalt-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.frontPreview} alt="Design preview" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-sm uppercase tracking-wide text-chrome-300">
                      {item.garment === "tee" ? "Tee" : "Snapback Cap"}, {SHIRT_COLORS[item.shirtColor].label}
                      {item.size ? `, Size ${item.size}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-chrome-400">{sponsorNames(item)}</p>
                    {item.driverName || item.carNumber ? (
                      <p className="mt-1 text-xs text-chrome-400/70">
                        Back: {item.driverName} {item.carNumber ? `#${item.carNumber}` : ""}
                      </p>
                    ) : null}
                    {results[item.id] ? (
                      <p
                        className={`mt-2 rounded-sm border px-2 py-1 text-[11px] ${
                          results[item.id].stubbed
                            ? "border-caution-500/30 bg-caution-500/10 text-caution-400"
                            : "border-flame-500/30 bg-flame-500/10 text-flame-400"
                        }`}
                      >
                        {results[item.id].note}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <span className="font-display text-lg text-flame-400">{formatUsd(item.priceCents)}</span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs uppercase tracking-wide text-chrome-400 underline hover:text-ember-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between rounded-md border border-white/10 bg-asphalt-800 p-4">
                <span className="font-display text-sm uppercase tracking-wide text-chrome-400">
                  {items.length} item{items.length === 1 ? "" : "s"}
                </span>
                <span className="font-display text-2xl text-chrome-300">
                  TOTAL <span className="text-flame-400">{formatUsd(total)}</span>
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  disabled={submitting}
                  className="flex-1 rounded-sm bg-flame-500 px-6 py-3.5 font-display uppercase tracking-wider text-asphalt-950 shadow-glow transition hover:bg-flame-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "SUBMITTING..." : "SUBMIT ORDER"}
                </button>
                <button
                  type="button"
                  onClick={() => clearCart()}
                  className="rounded-sm border border-white/15 px-6 py-3.5 font-display uppercase tracking-wider text-chrome-300 transition hover:border-ember-500/50 hover:text-ember-500"
                >
                  CLEAR CART
                </button>
              </div>
              <p className="text-center text-xs text-chrome-400/70">
                Submitting an order creates each item as a draft product in our Printify shop.
                There&apos;s no payment step wired up yet, this cart doesn&apos;t charge a card.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
