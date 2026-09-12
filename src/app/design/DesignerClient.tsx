"use client";

import { useMemo, useRef, useState } from "react";
import { GarmentMockup, SHIRT_COLORS, type ShirtColorId } from "@/components/GarmentMockup";
import { CheckeredFlagIcon } from "@/components/icons";
import { RC_BRANDS } from "@/lib/brands";
import { DEFAULT_FONT_ID, FONT_OPTIONS } from "@/lib/fonts";
import { GRAPHIC_OPTIONS, buildLiverySVG, type GraphicId, type NameTagStyle, type SponsorItem } from "@/lib/livery";
import {
  CAP_PRICE_CENTS,
  EXTRA_SPONSOR_PRICE_CENTS,
  INCLUDED_SPONSORS,
  MAX_SPONSORS,
  TEE_BLANK_LABEL,
  TEE_PRICE_CENTS,
  extraSponsorCount,
  formatUsd,
  totalPriceCents,
} from "@/lib/pricing";
import type { Garment } from "@/lib/types";

const TEE_SIZES = ["S", "M", "L", "XL", "XXL"] as const;
const NAME_TAG_STYLES: { id: NameTagStyle; label: string }[] = [
  { id: "bar", label: "Bar" },
  { id: "outline", label: "Outline" },
  { id: "badge", label: "Badge" },
];
const SHIRT_COLOR_IDS = Object.keys(SHIRT_COLORS) as ShirtColorId[];
const MAX_LOGO_BYTES = 1.5 * 1024 * 1024;
const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];

// Comfort Colors 1717 measurements, body width flat / length. Approximate
// from the standard published spec sheet, confirm against the current
// official chart before relying on this for real production.
const SIZE_GUIDE: Record<(typeof TEE_SIZES)[number], { width: string; length: string }> = {
  S: { width: '18"', length: '28"' },
  M: { width: '20"', length: '29"' },
  L: { width: '22"', length: '30"' },
  XL: { width: '24"', length: '31"' },
  XXL: { width: '26"', length: '32"' },
};

interface PrintifyResult {
  stubbed: boolean;
  productId?: string;
  note: string;
}

function sponsorLabel(s: SponsorItem, i: number): string {
  return s.kind === "text" ? s.label : `Logo ${i + 1}`;
}

export function DesignerClient() {
  const [garment, setGarment] = useState<Garment>("tee");
  const [shirtColor, setShirtColor] = useState<ShirtColorId>("black");
  const [graphic, setGraphic] = useState<GraphicId>("grid");
  const [fontId, setFontId] = useState(DEFAULT_FONT_ID);
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [primary, setPrimary] = useState("#ff5a1f");
  const [secondary, setSecondary] = useState("#ffc400");
  const [tertiary, setTertiary] = useState("#0a0c0f");
  const [size, setSize] = useState<(typeof TEE_SIZES)[number]>("M");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [driverName, setDriverName] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [nameTagStyle, setNameTagStyle] = useState<NameTagStyle>("bar");

  const [error, setError] = useState<string | null>(null);
  const [printify, setPrintify] = useState<PrintifyResult | null>(null);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableBrands = RC_BRANDS.filter(
    (b) => !sponsors.some((s) => s.kind === "text" && s.label === b)
  );
  const atMax = sponsors.length >= MAX_SPONSORS;
  const extras = extraSponsorCount(sponsors.length);
  const base = garment === "tee" ? TEE_PRICE_CENTS : CAP_PRICE_CENTS;
  const total = totalPriceCents(garment, sponsors.length);

  const svg = useMemo(
    () =>
      buildLiverySVG({
        primary,
        secondary,
        tertiary,
        sponsors,
        fontId,
        driverName,
        carNumber,
        nameTagStyle,
        graphic,
      }),
    [primary, secondary, tertiary, sponsors, fontId, driverName, carNumber, nameTagStyle, graphic]
  );

  function addBrand(name: string) {
    if (!name || atMax || sponsors.some((s) => s.kind === "text" && s.label === name)) return;
    setSponsors((prev) => [...prev, { kind: "text", label: name }]);
    setError(null);
  }

  function handleLogoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (atMax) {
      setError(`Maximum ${MAX_SPONSORS} sponsors reached.`);
      return;
    }
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setError("Logo must be a PNG, JPG, or WEBP image.");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setError("Logo file is too large. Keep it under 1.5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSponsors((prev) => [...prev, { kind: "image", dataUrl }]);
      setError(null);
    };
    reader.onerror = () => setError("Could not read that file. Try a different image.");
    reader.readAsDataURL(file);
  }

  function removeSponsor(i: number) {
    setSponsors((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSendToPrintify() {
    if (sponsors.length === 0) {
      setError("Add at least one sponsor first.");
      return;
    }
    setError(null);
    setSending(true);
    setPrintify(null);
    try {
      const imageDataUrl = await rasterize(svg, 1200);
      const sponsorLabels = sponsors.map(sponsorLabel);
      const res = await fetch("/api/printify/create-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          garment,
          shirtColor: SHIRT_COLORS[shirtColor].label,
          size: garment === "tee" ? size : undefined,
          sponsorCount: sponsors.length,
          sponsorLabels,
          title: `${sponsorLabels.join(" x ")} livery`,
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
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      {/* ── PREVIEW (sticky, like a product page's image column) ─────── */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-md border border-white/10 bg-asphalt-800 p-6 shadow-panel">
          <div className="mx-auto max-w-sm">
            <GarmentMockup garment={garment} garmentColor={shirtColor} label={sponsors.map((s, i) => sponsorLabel(s, i)).join(" x ")}>
              <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: svg }} />
            </GarmentMockup>
          </div>

          <div className="mt-5 space-y-1 rounded-sm bg-asphalt-900/60 p-3 text-sm">
            <div className="flex justify-between text-chrome-400">
              <span>BASE PRICE</span>
              <span>{formatUsd(base)}</span>
            </div>
            {extras > 0 ? (
              <div className="flex justify-between text-chrome-400">
                <span>
                  EXTRA SPONSORS ({extras} x {formatUsd(EXTRA_SPONSOR_PRICE_CENTS)})
                </span>
                <span>{formatUsd(extras * EXTRA_SPONSOR_PRICE_CENTS)}</span>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-white/10 pt-1.5 font-display text-lg text-chrome-300">
              <span>TOTAL</span>
              <span className="text-flame-400">{formatUsd(total)}</span>
            </div>
          </div>

          {error ? <p className="mt-3 text-sm text-ember-500">{error}</p> : null}

          <button
            type="button"
            onClick={handleSendToPrintify}
            disabled={sending}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm bg-flame-500 px-6 py-3.5 font-display text-base uppercase tracking-wider text-asphalt-950 shadow-glow transition hover:bg-flame-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckeredFlagIcon className="h-4 w-4" />
            {sending ? "SENDING..." : "SEND TO PRINTIFY"}
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

          <p className="mt-4 text-center text-xs text-chrome-400/70">
            Sponsor names are shown in original typography we design, not licensed logos, and
            not affiliated with or endorsed by any brand listed.
          </p>
        </div>
      </div>

      {/* ── CONTROLS ─────────────────────────────────────────────────── */}
      <div className="space-y-6 rounded-md border border-white/10 bg-asphalt-800 p-6 shadow-panel">
        <div>
          <Label>GARMENT</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["tee", "cap"] as Garment[]).map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => setGarment(g)}
                className={segmentClass(garment === g)}
              >
                {g === "tee" ? `TEE (${TEE_BLANK_LABEL.toUpperCase()})` : "SNAPBACK CAP"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>SHIRT COLOR</Label>
          <div className="mt-2 flex flex-wrap gap-3">
            {SHIRT_COLOR_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setShirtColor(id)}
                aria-label={SHIRT_COLORS[id].label}
                title={SHIRT_COLORS[id].label}
                className={`h-9 w-9 rounded-full border-2 transition ${
                  shirtColor === id ? "border-flame-500 shadow-glow" : "border-white/20 hover:border-white/40"
                }`}
                style={{ backgroundColor: SHIRT_COLORS[id].hex }}
              />
            ))}
            <span className="self-center text-xs uppercase tracking-wide text-chrome-400">
              {SHIRT_COLORS[shirtColor].label}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <Label htmlFor="brand-picker">SPONSORS (UP TO {MAX_SPONSORS})</Label>
            <span className="text-[11px] normal-case text-chrome-400/70">
              first {INCLUDED_SPONSORS} included, +{formatUsd(EXTRA_SPONSOR_PRICE_CENTS)} each after
            </span>
          </div>

          <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
            <select
              id="brand-picker"
              value=""
              disabled={atMax}
              onChange={(e) => addBrand(e.target.value)}
              className={`${selectClass} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <option value="">{atMax ? "MAXIMUM REACHED" : "+ ADD AN RC BRAND..."}</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={atMax}
              className="whitespace-nowrap rounded-sm border border-white/15 px-3 text-sm font-display uppercase tracking-wide text-chrome-300 transition hover:border-flame-500/50 hover:text-flame-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              UPLOAD LOGO
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleLogoPick}
              className="hidden"
            />
          </div>
          <p className="mt-1 text-[11px] text-chrome-400/60">PNG, JPG, or WEBP, up to 1.5MB.</p>

          {sponsors.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {sponsors.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center gap-1.5 rounded-sm border border-flame-500/30 bg-flame-500/10 py-1 pl-1.5 pr-1.5 text-xs font-medium text-flame-400"
                >
                  {s.kind === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.dataUrl}
                      alt="Uploaded logo"
                      className="h-6 w-6 rounded-sm border object-cover"
                      style={{ borderColor: i % 2 === 0 ? primary : secondary }}
                    />
                  ) : null}
                  <span className="pl-0.5">{sponsorLabel(s, i)}</span>
                  <span className="text-chrome-400/70">
                    {i < INCLUDED_SPONSORS ? "included" : `+${formatUsd(EXTRA_SPONSOR_PRICE_CENTS)}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSponsor(i)}
                    aria-label={`Remove ${sponsorLabel(s, i)}`}
                    className="ml-1 rounded-sm px-1 text-chrome-400 hover:bg-white/10 hover:text-ember-500"
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <Label>COLORS</Label>
            <a
              href="https://htmlcolorcodes.com/color-picker/"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] normal-case text-flame-400 underline decoration-flame-500/40 underline-offset-2 hover:text-flame-300"
            >
              FIND A HEX / RGB CODE ↗
            </a>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-3">
            <ColorField label="PRIMARY" value={primary} onChange={setPrimary} />
            <ColorField label="SECONDARY" value={secondary} onChange={setSecondary} />
            <ColorField label="TERTIARY" value={tertiary} onChange={setTertiary} />
          </div>
        </div>

        <div>
          <Label htmlFor="font">FONT</Label>
          <select id="font" value={fontId} onChange={(e) => setFontId(e.target.value)} className={selectClass}>
            {FONT_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
          <p
            className="mt-2 truncate rounded-sm border border-white/10 bg-asphalt-900 px-3 py-2 text-lg text-chrome-300"
            style={{ fontFamily: `'${FONT_OPTIONS.find((f) => f.id === fontId)?.family}', sans-serif` }}
          >
            FLAMEOUT RC 2026
          </p>
        </div>

        <div>
          <Label>GRAPHIC</Label>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {GRAPHIC_OPTIONS.map((g) => (
              <GraphicThumb
                key={g.id}
                id={g.id}
                label={g.label}
                active={graphic === g.id}
                onClick={() => setGraphic(g.id)}
                primary={primary}
                secondary={secondary}
                tertiary={tertiary}
                fontId={fontId}
                sponsors={sponsors}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-5">
          <Label>NAME TAG (OPTIONAL)</Label>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <input
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="DRIVER NAME"
              maxLength={20}
              className={inputClass}
            />
            <input
              value={carNumber}
              onChange={(e) => setCarNumber(e.target.value.replace(/[^0-9A-Za-z]/g, ""))}
              placeholder="CAR NUMBER"
              maxLength={4}
              className={inputClass}
            />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {NAME_TAG_STYLES.map((n) => (
              <button
                type="button"
                key={n.id}
                onClick={() => setNameTagStyle(n.id)}
                className={segmentClass(nameTagStyle === n.id)}
              >
                {n.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {garment === "tee" ? (
          <div className="border-t border-white/10 pt-5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="size">SIZE</Label>
              <button
                type="button"
                onClick={() => setShowSizeGuide((v) => !v)}
                className="text-[11px] normal-case text-flame-400 underline decoration-flame-500/40 underline-offset-2 hover:text-flame-300"
              >
                {showSizeGuide ? "HIDE SIZE GUIDE" : "SIZE GUIDE"}
              </button>
            </div>
            <select id="size" value={size} onChange={(e) => setSize(e.target.value as typeof size)} className={selectClass}>
              {TEE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {showSizeGuide ? (
              <div className="mt-3 overflow-x-auto rounded-sm border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-asphalt-900 text-chrome-400">
                      <th className="px-3 py-2 font-display uppercase tracking-wide">Size</th>
                      <th className="px-3 py-2 font-display uppercase tracking-wide">Chest Width</th>
                      <th className="px-3 py-2 font-display uppercase tracking-wide">Body Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TEE_SIZES.map((s) => (
                      <tr key={s} className="border-t border-white/10 text-chrome-300">
                        <td className="px-3 py-2 font-display">{s}</td>
                        <td className="px-3 py-2">{SIZE_GUIDE[s].width}</td>
                        <td className="px-3 py-2">{SIZE_GUIDE[s].length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="border-t border-white/10 px-3 py-2 text-[11px] text-chrome-400/70">
                  {TEE_BLANK_LABEL} measurements, laid flat. Approximate, confirm against the
                  official spec sheet before a real launch.
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function GraphicThumb({
  id,
  label,
  active,
  onClick,
  primary,
  secondary,
  tertiary,
  fontId,
  sponsors,
}: {
  id: GraphicId;
  label: string;
  active: boolean;
  onClick: () => void;
  primary: string;
  secondary: string;
  tertiary: string;
  fontId: string;
  sponsors: SponsorItem[];
}) {
  const thumbSvg = useMemo(
    () =>
      buildLiverySVG({
        primary,
        secondary,
        tertiary,
        sponsors: sponsors.length ? sponsors : [{ kind: "text", label: "YOUR-LOGO" }],
        fontId,
        graphic: id,
      }),
    [primary, secondary, tertiary, sponsors, fontId, id]
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-sm border p-1.5 transition ${
        active ? "border-flame-500 shadow-glow" : "border-white/15 hover:border-white/35"
      }`}
    >
      <div className="aspect-square w-full overflow-hidden rounded-sm bg-asphalt-900" dangerouslySetInnerHTML={{ __html: thumbSvg }} />
      <span className="text-[10px] uppercase tracking-wide text-chrome-400">{label.split(": ")[1] ?? label}</span>
    </button>
  );
}

// Rasterizes the live SVG to a PNG data URL before it goes to Printify,
// which expects raster artwork. Falls back to the raw SVG data URI if
// canvas rasterization fails for any reason (older browser, etc.) so the
// flow never hard-breaks.
async function rasterize(svg: string, size: number): Promise<string> {
  try {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("Could not rasterize design"));
        el.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unsupported");
      ctx.drawImage(img, 0, 0, size, size);
      return canvas.toDataURL("image/png");
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    const bytes = new TextEncoder().encode(svg);
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    return `data:image/svg+xml;base64,${btoa(binary)}`;
  }
}

const inputClass =
  "mt-2 w-full rounded-sm border border-white/15 bg-asphalt-900 px-3 py-2.5 text-sm uppercase text-chrome-300 placeholder:text-chrome-400/50 focus:border-flame-500 focus:outline-none";

const selectClass = `${inputClass} appearance-none`;

function segmentClass(active: boolean) {
  return [
    "rounded-sm border px-3 py-2.5 text-sm font-display uppercase tracking-wide transition",
    active
      ? "border-flame-500 bg-flame-500/15 text-flame-400"
      : "border-white/15 text-chrome-400 hover:border-white/30",
  ].join(" ");
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="font-display text-xs uppercase tracking-widest text-chrome-400">
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
      <label className="text-[10px] uppercase tracking-widest text-chrome-400">{label}</label>
      <div className="mt-1.5 flex items-center gap-1.5 rounded-sm border border-white/15 bg-asphalt-900 px-2 py-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-7 flex-shrink-0 cursor-pointer rounded-sm border border-white/10 bg-transparent"
          aria-label={label}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent text-xs text-chrome-300 focus:outline-none"
        />
      </div>
    </div>
  );
}
