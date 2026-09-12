"use client";

import { useMemo, useState } from "react";
import { GarmentMockup } from "@/components/GarmentMockup";
import { CheckeredFlagIcon } from "@/components/icons";
import { RC_BRANDS } from "@/lib/brands";
import { liverySvgDataUri } from "@/lib/livery";
import {
  CAP_PRICE_CENTS,
  EXTRA_BRAND_PRICE_CENTS,
  MAX_BRANDS,
  TEE_BLANKS,
  basePriceCents,
  extraBrandCount,
  formatUsd,
  totalPriceCents,
  type TeeBlank,
} from "@/lib/pricing";
import {
  DISCIPLINE_LABEL,
  STYLE_LABEL,
  type Discipline,
  type DesignStyle,
  type Garment,
} from "@/lib/types";

const DISCIPLINES = Object.keys(DISCIPLINE_LABEL) as Discipline[];
const STYLES = Object.keys(STYLE_LABEL) as DesignStyle[];
const TEE_SIZES = ["S", "M", "L", "XL", "XXL"];

interface PrintifyResult {
  stubbed: boolean;
  productId?: string;
  note: string;
}

export function DesignerClient() {
  const [step, setStep] = useState<1 | 2>(1);

  const [garment, setGarment] = useState<Garment>("tee");
  const [blank, setBlank] = useState<TeeBlank>("gildan");
  const [discipline, setDiscipline] = useState<Discipline>("buggy");
  const [style, setStyle] = useState<DesignStyle>("flame");
  const [brands, setBrands] = useState<string[]>([]);
  const [primary, setPrimary] = useState("#ff5a1f");
  const [secondary, setSecondary] = useState("#ffc400");
  const [size, setSize] = useState("M");

  const [error, setError] = useState<string | null>(null);
  const [printify, setPrintify] = useState<PrintifyResult | null>(null);
  const [sending, setSending] = useState(false);

  const availableBrands = RC_BRANDS.filter((b) => !brands.includes(b));
  const atMax = brands.length >= MAX_BRANDS;
  const extras = extraBrandCount(brands.length);
  const base = garment === "tee" ? TEE_BLANKS[blank].priceCents : CAP_PRICE_CENTS;
  const total = totalPriceCents(garment, blank, brands.length);

  const imageDataUrl = useMemo(
    () =>
      liverySvgDataUri({
        primary,
        secondary,
        brands,
        tag: DISCIPLINE_LABEL[discipline],
        style,
        size: 1024,
      }),
    [primary, secondary, brands, discipline, style]
  );

  function addBrand(name: string) {
    if (!name || atMax || brands.includes(name)) return;
    setBrands((prev) => [...prev, name]);
    setError(null);
  }

  function removeBrand(name: string) {
    setBrands((prev) => prev.filter((b) => b !== name));
  }

  function goToShirt() {
    if (brands.length === 0) {
      setError("Add at least one RC brand first.");
      return;
    }
    setError(null);
    setPrintify(null);
    setStep(2);
  }

  async function handleSendToPrintify() {
    setSending(true);
    setPrintify(null);
    try {
      const res = await fetch("/api/printify/create-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          garment,
          blank,
          brands,
          title: `${brands.join(" × ")} — ${DISCIPLINE_LABEL[discipline]}`,
          imageDataUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Printify request failed");
      setPrintify(data);
    } catch (err) {
      setPrintify({ stubbed: true, note: err instanceof Error ? err.message : "Request failed" });
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      {/* ── STEP INDICATOR ───────────────────────────────────────────── */}
      <div className="mb-8 flex items-center gap-3 font-display text-xs font-bold uppercase tracking-widest">
        <StepDot active={step === 1} done={step === 2} label="1. Design" />
        <span className="h-px w-8 bg-white/15" />
        <StepDot active={step === 2} done={false} label="2. On the Shirt" />
      </div>

      {step === 1 ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* ── FORM ─────────────────────────────────────────────────── */}
          <div className="space-y-6 rounded-md border border-white/10 bg-asphalt-800 p-6 shadow-panel">
            <div>
              <Label>Garment</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["tee", "cap"] as Garment[]).map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGarment(g)}
                    className={segmentClass(garment === g)}
                  >
                    {g === "tee" ? "Tee" : "Snapback Cap"}
                  </button>
                ))}
              </div>
            </div>

            {garment === "tee" ? (
              <div>
                <Label htmlFor="blank">Blank</Label>
                <select
                  id="blank"
                  value={blank}
                  onChange={(e) => setBlank(e.target.value as TeeBlank)}
                  className={selectClass}
                >
                  {(Object.keys(TEE_BLANKS) as TeeBlank[]).map((b) => (
                    <option key={b} value={b}>
                      {TEE_BLANKS[b].label} — {formatUsd(TEE_BLANKS[b].priceCents)}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div>
              <Label htmlFor="discipline">RC Discipline</Label>
              <select
                id="discipline"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as Discipline)}
                className={selectClass}
              >
                {DISCIPLINES.map((d) => (
                  <option key={d} value={d}>
                    {DISCIPLINE_LABEL[d]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <Label htmlFor="brand-picker">RC brands (up to {MAX_BRANDS})</Label>
                <span className="text-[11px] normal-case text-chrome-400/70">
                  1st included · each extra +{formatUsd(EXTRA_BRAND_PRICE_CENTS)}
                </span>
              </div>
              <select
                id="brand-picker"
                value=""
                disabled={atMax}
                onChange={(e) => addBrand(e.target.value)}
                className={`${selectClass} disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <option value="">{atMax ? "Maximum reached" : "+ Add an RC brand…"}</option>
                {availableBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              {brands.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {brands.map((b, i) => (
                    <li
                      key={b}
                      className="flex items-center gap-1.5 rounded-sm border border-flame-500/30 bg-flame-500/10 py-1 pl-3 pr-1.5 text-xs font-medium text-flame-400"
                    >
                      {b}
                      {i > 0 ? (
                        <span className="text-chrome-400/70">
                          +{formatUsd(EXTRA_BRAND_PRICE_CENTS)}
                        </span>
                      ) : (
                        <span className="text-chrome-400/70">included</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeBrand(b)}
                        aria-label={`Remove ${b}`}
                        className="ml-1 rounded-sm px-1 text-chrome-400 hover:bg-white/10 hover:text-ember-500"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ColorField label="Primary color" value={primary} onChange={setPrimary} />
              <ColorField label="Secondary color" value={secondary} onChange={setSecondary} />
            </div>

            <div>
              <Label htmlFor="style">Design style</Label>
              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value as DesignStyle)}
                className={selectClass}
              >
                {STYLES.map((s) => (
                  <option key={s} value={s}>
                    {STYLE_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>

            {garment === "tee" ? (
              <div>
                <Label htmlFor="size">Size</Label>
                <select id="size" value={size} onChange={(e) => setSize(e.target.value)} className={selectClass}>
                  {TEE_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {error ? <p className="text-sm text-ember-500">{error}</p> : null}

            <PriceSummary base={base} extras={extras} total={total} />

            <button
              type="button"
              onClick={goToShirt}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-flame-500 px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-asphalt-950 shadow-glow transition hover:bg-flame-400"
            >
              <CheckeredFlagIcon className="h-4 w-4" />
              Continue: See on Shirt →
            </button>
          </div>

          {/* ── LIVE DESIGN PREVIEW ──────────────────────────────────── */}
          <div className="flex flex-col">
            <div className="rounded-md border border-white/10 bg-asphalt-800 p-6 shadow-panel">
              <p className="mb-4 text-center font-display text-xs font-bold uppercase tracking-widest text-chrome-400">
                Live design preview
              </p>
              <div className="mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-md border border-white/10 bg-asphalt-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageDataUrl}
                  alt={`${brands.join(", ") || "Your brands"} design preview`}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-4 text-center text-xs text-chrome-400/70">
                Updates instantly as you change brands, colors, or style.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* ── FULL GARMENT MOCKUP ──────────────────────────────────── */}
          <div className="rounded-md border border-white/10 bg-asphalt-800 p-6 shadow-panel">
            <div className="mx-auto max-w-xs">
              <GarmentMockup garment={garment} garmentColor="black" label={brands.join(" × ")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageDataUrl}
                  alt={`${brands.join(", ")} on a ${garment}`}
                  className="h-full w-full object-cover"
                />
              </GarmentMockup>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-5 w-full rounded-sm border border-white/15 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-chrome-300 transition hover:border-flame-500/50 hover:text-flame-400"
            >
              ← Back to Edit
            </button>
          </div>

          {/* ── ORDER SUMMARY / CHECKOUT ─────────────────────────────── */}
          <div className="flex flex-col">
            <div className="rounded-md border border-white/10 bg-asphalt-800 p-6 shadow-panel">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-chrome-400">
                Order summary
              </p>
              <dl className="mt-3 space-y-1.5 text-sm text-chrome-300">
                <SummaryRow label="Garment">
                  {garment === "tee" ? `Tee · ${TEE_BLANKS[blank].label} · Size ${size}` : "Snapback Cap"}
                </SummaryRow>
                <SummaryRow label="Discipline">{DISCIPLINE_LABEL[discipline]}</SummaryRow>
                <SummaryRow label="Style">{STYLE_LABEL[style]}</SummaryRow>
                <SummaryRow label="Brands">{brands.join(", ")}</SummaryRow>
              </dl>

              <div className="mt-5 border-t border-white/10 pt-4">
                <PriceSummary base={base} extras={extras} total={total} />
              </div>

              <button
                type="button"
                onClick={handleSendToPrintify}
                disabled={sending}
                className="mt-5 w-full rounded-sm bg-flame-500 px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-asphalt-950 shadow-glow transition hover:bg-flame-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send to Printify →"}
              </button>

              {printify ? (
                <p
                  className={`mt-3 rounded-sm border px-3 py-2 text-xs ${
                    printify.stubbed
                      ? "border-caution-500/30 bg-caution-500/10 text-caution-400"
                      : "border-flame-500/30 bg-flame-500/10 text-flame-400"
                  }`}
                >
                  {printify.note}
                  {printify.productId ? ` (product id: ${printify.productId})` : ""}
                </p>
              ) : null}
            </div>

            <p className="mt-4 text-center text-xs text-chrome-400/70">
              Brand names are shown in original typography we design — not
              licensed logos, and not affiliated with or endorsed by any
              manufacturer listed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function PriceSummary({ base, extras, total }: { base: number; extras: number; total: number }) {
  return (
    <div className="space-y-1 rounded-sm bg-asphalt-900/60 p-3 text-sm">
      <div className="flex justify-between text-chrome-400">
        <span>Base price</span>
        <span>{formatUsd(base)}</span>
      </div>
      {extras > 0 ? (
        <div className="flex justify-between text-chrome-400">
          <span>
            Extra brands ({extras} × {formatUsd(EXTRA_BRAND_PRICE_CENTS)})
          </span>
          <span>{formatUsd(extras * EXTRA_BRAND_PRICE_CENTS)}</span>
        </div>
      ) : null}
      <div className="flex justify-between border-t border-white/10 pt-1.5 font-display text-base font-bold text-chrome-300">
        <span>Total</span>
        <span className="text-flame-400">{formatUsd(total)}</span>
      </div>
    </div>
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-chrome-400">{label}</dt>
      <dd className="text-right text-chrome-300">{children}</dd>
    </div>
  );
}

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <span className={active ? "text-flame-400" : done ? "text-chrome-300" : "text-chrome-400/50"}>
      {label}
    </span>
  );
}

const inputClass =
  "mt-2 w-full rounded-sm border border-white/15 bg-asphalt-900 px-3 py-2.5 text-sm text-chrome-300 placeholder:text-chrome-400/50 focus:border-flame-500 focus:outline-none";

const selectClass = `${inputClass} appearance-none`;

function segmentClass(active: boolean) {
  return [
    "rounded-sm border px-3 py-2.5 text-sm font-display font-semibold uppercase tracking-wide transition",
    active
      ? "border-flame-500 bg-flame-500/15 text-flame-400"
      : "border-white/15 text-chrome-400 hover:border-white/30",
  ].join(" ");
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-display text-xs font-bold uppercase tracking-widest text-chrome-400"
    >
      {children}
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex items-center gap-2 rounded-sm border border-white/15 bg-asphalt-900 px-2 py-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-9 cursor-pointer rounded-sm border border-white/10 bg-transparent"
          aria-label={label}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-chrome-300 focus:outline-none"
        />
      </div>
    </div>
  );
}
