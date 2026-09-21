// Deterministic, layout-based sponsor-print generator.
//
// This is the actual design engine, not a placeholder for something AI
// would otherwise produce. Given the sponsors (typed brand names and/or
// uploaded logo images), three colors, and a font a customer picks, it
// renders print-ready artwork entirely from typography and vector shapes,
// meant to sit directly on a photographed garment the way a real screen
// print would (transparent background, no panel/badge shape behind it).
//
// Two separate outputs: buildFrontSVG (sponsors, for the chest) and
// buildBackSVG (driver name / car number, for the back). Runs identically
// in the browser (live preview as the customer picks options) and on the
// server, pure functions, no Node-only APIs.

import { fontStack } from "./fonts";
import { MAX_SPONSORS } from "./pricing";

export type SponsorItem = { kind: "text"; label: string } | { kind: "image"; dataUrl: string };

export interface ColorSet {
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface FrontOptions extends ColorSet {
  /** 1-10 sponsors, in the order the customer added them. */
  sponsors: SponsorItem[];
  fontId?: string;
}

export interface BackOptions extends ColorSet {
  driverName?: string;
  carNumber?: string;
  fontId?: string;
}

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function fitText(raw: string, max = 20): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}

function fitFontSize(text: string, cap = 92): number {
  const len = text.length;
  if (len <= 6) return cap;
  if (len <= 9) return cap * 0.83;
  if (len <= 12) return cap * 0.65;
  if (len <= 16) return cap * 0.52;
  return cap * 0.41;
}

// Deterministic per-design id (same on server and client) so multiple
// inline SVGs on one page never collide, without breaking SSR hydration
// the way Math.random() would.
function designUid(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
}

// A logo image sponsor gets a thin colored frame instead of floating as a
// bare raster, so it visibly picks up the customer's chosen palette even
// though the pixels inside aren't recolored.
function imageChip(dataUrl: string, x: number, y: number, w: number, h: number, primary: string, secondary: string): string {
  const pad = w * 0.08;
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#0a0c0f" opacity="0.55" stroke="${primary}" stroke-width="3" />
    <rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="6" fill="none" stroke="${secondary}" stroke-width="1.2" opacity="0.8" />
    <image href="${dataUrl}" x="${x + pad}" y="${y + pad}" width="${w - pad * 2}" height="${h - pad * 2}" preserveAspectRatio="xMidYMid meet" />`;
}

/**
 * Front-of-shirt artwork: sponsor names/logos, printed directly (a soft
 * glow behind a single mark, a stacked alternating-color board for 2+),
 * with a transparent canvas everywhere else so it reads as ink on fabric
 * rather than a printed sticker.
 */
export function buildFrontSVG(opts: FrontOptions): string {
  const { primary, secondary, tertiary, fontId } = opts;
  const fontFamily = fontStack(fontId ?? "anton");
  const uid = designUid(`${primary}|${secondary}|${tertiary}|${fontId}|${opts.sponsors.map((s) => (s.kind === "text" ? s.label : s.dataUrl.length)).join(",")}`);
  const items = opts.sponsors.length
    ? opts.sponsors.slice(0, MAX_SPONSORS)
    : [{ kind: "text", label: "YOUR SPONSOR" } as const];

  const defs = `
    <radialGradient id="glow-${uid}" cx="0.5" cy="0.45" r="0.6">
      <stop offset="0" stop-color="${tertiary}" stop-opacity="0.35" />
      <stop offset="1" stop-color="${tertiary}" stop-opacity="0" />
    </radialGradient>`;

  let mid: string;
  if (items.length === 1) {
    const item = items[0];
    if (item.kind === "image") {
      mid = `<rect width="800" height="800" fill="url(#glow-${uid})" />${imageChip(item.dataUrl, 220, 220, 360, 360, primary, secondary)}`;
    } else {
      const t = fitText(item.label);
      const safe = escapeXml(t.toUpperCase());
      const fs = fitFontSize(t, 108);
      mid = `
        <rect width="800" height="800" fill="url(#glow-${uid})" />
        <text x="400" y="${420 + fs * 0.18}" text-anchor="middle" font-family="${fontFamily}" font-size="${fs}" letter-spacing="2" fill="${primary}" stroke="${tertiary}" stroke-width="3" paint-order="stroke">${safe}</text>`;
    }
  } else {
    const rowHeight = Math.min(84, 340 / (items.length - 1));
    const fontSize = Math.max(20, Math.min(56, rowHeight * 0.74));
    const totalHeight = rowHeight * (items.length - 1);
    const startY = 400 - totalHeight / 2;
    mid = `<rect width="800" height="800" fill="url(#glow-${uid})" />`;
    mid += items
      .map((item, i) => {
        const y = startY + i * rowHeight;
        if (item.kind === "image") {
          const box = fontSize * 1.8;
          return imageChip(item.dataUrl, 400 - box / 2, y - box * 0.72, box, box, primary, secondary);
        }
        const t = fitText(item.label, 18);
        const safe = escapeXml(t.toUpperCase());
        const fill = i % 2 === 0 ? primary : secondary;
        const markerFill = i % 2 === 0 ? secondary : primary;
        return `
          <rect x="120" y="${y - fontSize * 0.72}" width="9" height="9" fill="${markerFill}" transform="rotate(45 125 ${y - fontSize * 0.67})" />
          <text x="400" y="${y}" text-anchor="middle" font-family="${fontFamily}" font-size="${fontSize}" letter-spacing="1.5" fill="${fill}" stroke="${tertiary}" stroke-width="2" paint-order="stroke">${safe}</text>`;
      })
      .join("");
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    <defs>${defs}</defs>
    ${mid}
  </svg>`;
}

/**
 * Back-of-shirt artwork: driver name over a big car number, like a real
 * jersey back. Kept as one consistent layout (no style picker) since the
 * palette alone gives it plenty of range.
 */
export function buildBackSVG(opts: BackOptions): string {
  const { primary, secondary, tertiary, fontId } = opts;
  const fontFamily = fontStack(fontId ?? "anton");
  const name = (opts.driverName ?? "").trim();
  const num = (opts.carNumber ?? "").trim().replace(/^#/, "");

  if (!name && !num) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%"></svg>`;
  }

  const safeName = escapeXml(fitText(name, 16).toUpperCase());
  const safeNum = escapeXml(num.slice(0, 3));

  const nameBlock = safeName
    ? `<text x="400" y="230" text-anchor="middle" font-family="${fontFamily}" font-size="${fitFontSize(
        safeName,
        58
      )}" letter-spacing="3" fill="${primary}" stroke="${tertiary}" stroke-width="2" paint-order="stroke">${safeName}</text>`
    : "";

  const numBlock = safeNum
    ? `
      <text x="400" y="560" text-anchor="middle" font-family="${fontFamily}" font-size="340" letter-spacing="0" fill="${secondary}" stroke="${tertiary}" stroke-width="6" paint-order="stroke">${safeNum}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    ${nameBlock}
    ${numBlock}
  </svg>`;
}

export function frontSvgDataUri(opts: FrontOptions): string {
  return `data:image/svg+xml;base64,${toBase64Utf8(buildFrontSVG(opts))}`;
}

export function backSvgDataUri(opts: BackOptions): string {
  return `data:image/svg+xml;base64,${toBase64Utf8(buildBackSVG(opts))}`;
}

// Works identically under Node (local dev/build), the browser (client-side
// live preview), and the Workers edge runtime (Cloudflare Pages), plain
// `btoa` only handles Latin1, so we widen each byte through TextEncoder
// first rather than reaching for the Node-only `Buffer`.
function toBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
