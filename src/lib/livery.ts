// Deterministic, layout-based sponsor-graphic generator.
//
// This is the actual design engine, not a placeholder for something AI
// would otherwise produce. Given the sponsors (typed brand names and/or
// uploaded logo images), three colors, a font, a name tag, and one of 5
// graphic templates a customer picks, it renders a print-ready badge
// entirely from vector shapes and typography, the same way a real RC
// sponsor decal sheet is laid out (grid, star, shield, bolt, spear).
//
// Runs identically in the browser (live preview as the customer picks
// options) and on the server, pure functions, no Node-only APIs.

import { fontStack } from "./fonts";
import { MAX_SPONSORS } from "./pricing";

export type GraphicId = "grid" | "star" | "shield" | "bolt" | "spear";
export type NameTagStyle = "bar" | "outline" | "badge";

export type SponsorItem = { kind: "text"; label: string } | { kind: "image"; dataUrl: string };

export const GRAPHIC_OPTIONS: { id: GraphicId; label: string }[] = [
  { id: "grid", label: "Graphic 1: Grid" },
  { id: "star", label: "Graphic 2: Star" },
  { id: "shield", label: "Graphic 3: Shield" },
  { id: "bolt", label: "Graphic 4: Bolt" },
  { id: "spear", label: "Graphic 5: Spear" },
];

export interface LiveryOptions {
  primary: string;
  secondary: string;
  tertiary: string;
  /** 1-10 sponsors, in the order the customer added them. */
  sponsors: SponsorItem[];
  fontId?: string;
  driverName?: string;
  carNumber?: string;
  nameTagStyle?: NameTagStyle;
  graphic?: GraphicId;
}

interface Band {
  cx: number;
  cy: number;
  width: number;
  height: number;
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

const CHECKER = (id: string) => `
  <pattern id="${id}" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="18" height="18" fill="#0a0c0f" />
    <rect width="9" height="9" fill="#f4f5f6" />
    <rect x="9" y="9" width="9" height="9" fill="#f4f5f6" />
  </pattern>`;

function starPath(cx: number, cy: number, points: number, outerR: number, innerR: number): string {
  const step = Math.PI / points;
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)} `;
  }
  return `${d}Z`;
}

// A logo image sponsor gets a colored frame instead of floating as a bare
// raster, so it visibly picks up the customer's chosen palette even
// though the pixels inside aren't recolored.
function imageChip(dataUrl: string, x: number, y: number, w: number, h: number, primary: string, secondary: string): string {
  const pad = w * 0.1;
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#0a0c0f" stroke="${primary}" stroke-width="4" />
    <rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="7" fill="none" stroke="${secondary}" stroke-width="1.5" opacity="0.85" />
    <image href="${dataUrl}" x="${x + pad}" y="${y + pad}" width="${w - pad * 2}" height="${h - pad * 2}" preserveAspectRatio="xMidYMid meet" />`;
}

// Lays sponsors out inside `band` (the safe interior of whichever graphic
// shape is behind it): a single sponsor is one big centered mark; 2+ stack
// as rows, alternating primary/secondary text, sized and spaced to the
// band's own width/height so it fits a tall narrow shield the same as a
// wide grid panel.
function renderSponsorBlock(
  sponsors: SponsorItem[],
  primary: string,
  secondary: string,
  textFill: string,
  textStroke: string,
  fontFamily: string,
  band: Band
): string {
  const items = sponsors.length
    ? sponsors.slice(0, MAX_SPONSORS)
    : [{ kind: "text", label: "YOUR SPONSOR" } as const];
  const { cx, cy, width, height } = band;

  if (items.length === 1) {
    const item = items[0];
    if (item.kind === "image") {
      const box = Math.min(width, height) * 0.75;
      return imageChip(item.dataUrl, cx - box / 2, cy - box / 2, box, box, primary, secondary);
    }
    const maxChars = Math.max(6, Math.round(width / 26));
    const t = fitText(item.label, maxChars);
    const safe = escapeXml(t.toUpperCase());
    const fs = Math.min(fitFontSize(t, 92), height * 0.85);
    return `<text x="${cx}" y="${cy + fs * 0.32}" text-anchor="middle" font-family="${fontFamily}" font-size="${fs}" letter-spacing="2" fill="${textFill}" stroke="${textStroke}" stroke-width="2" paint-order="stroke">${safe}</text>`;
  }

  const rowHeight = Math.min(80, height / (items.length - 1));
  const fontSize = Math.max(18, Math.min(50, rowHeight * 0.72, width * 0.1));
  const totalHeight = rowHeight * (items.length - 1);
  const startY = cy - totalHeight / 2;
  const maxChars = Math.max(6, Math.round(width / (fontSize * 0.62)));
  const markerX = cx - width * 0.43;

  return items
    .map((item, i) => {
      const y = startY + i * rowHeight;
      if (item.kind === "image") {
        const box = fontSize * 1.7;
        return imageChip(item.dataUrl, cx - box / 2, y - box * 0.72, box, box, primary, secondary);
      }
      const t = fitText(item.label, maxChars);
      const safe = escapeXml(t.toUpperCase());
      const fill = i % 2 === 0 ? textFill : secondary;
      const markerFill = i % 2 === 0 ? secondary : primary;
      return `
        <rect x="${markerX}" y="${y - fontSize * 0.72}" width="10" height="10" fill="${markerFill}" transform="rotate(45 ${markerX + 5} ${
        y - fontSize * 0.67
      })" />
        <text x="${cx}" y="${y}" text-anchor="middle" font-family="${fontFamily}" font-size="${fontSize}" letter-spacing="1.5" fill="${fill}" stroke="${textStroke}" stroke-width="1.4" paint-order="stroke">${safe}</text>`;
    })
    .join("");
}

function renderNameTag(opts: {
  driverName?: string;
  carNumber?: string;
  style: NameTagStyle;
  primary: string;
  secondary: string;
  fontFamily: string;
}): string {
  const { driverName = "", carNumber = "", style, primary, secondary, fontFamily } = opts;
  const name = driverName.trim();
  const num = carNumber.trim() ? `#${carNumber.trim().replace(/^#/, "")}` : "";
  const combined = [name, num].filter(Boolean).join("   ");
  if (!combined) return "";

  const safe = escapeXml(combined.toUpperCase());
  const fontSize = combined.length > 16 ? 26 : 32;
  const baseline = 764;

  if (style === "bar") {
    const w = Math.min(680, Math.max(220, safe.length * fontSize * 0.62));
    const x = 400 - w / 2;
    return `
      <rect x="${x}" y="${baseline - fontSize - 8}" width="${w}" height="${fontSize + 20}" fill="${secondary}" />
      <text x="400" y="${baseline}" text-anchor="middle" font-family="${fontFamily}" font-size="${fontSize}" letter-spacing="2" fill="#0a0c0f">${safe}</text>`;
  }

  if (style === "badge") {
    const w = Math.min(420, Math.max(150, safe.length * fontSize * 0.62 + 40));
    const h = fontSize + 22;
    const x = 400 - w / 2;
    return `
      <rect x="${x}" y="${baseline - fontSize - 6}" width="${w}" height="${h}" rx="${h / 2}" fill="${primary}" stroke="${secondary}" stroke-width="3" />
      <text x="400" y="${baseline}" text-anchor="middle" font-family="${fontFamily}" font-size="${fontSize}" letter-spacing="2" fill="#0a0c0f">${safe}</text>`;
  }

  // outline: text only, no background plate
  return `<text x="400" y="${baseline}" text-anchor="middle" font-family="${fontFamily}" font-size="${fontSize}" letter-spacing="2" fill="none" stroke="${primary}" stroke-width="2">${safe}</text>`;
}

interface GraphicResult {
  defs: string;
  mid: string;
  textFill: string;
  textStroke: string;
  band: Band;
}

function buildGraphic(
  graphic: GraphicId,
  primary: string,
  secondary: string,
  tertiary: string,
  uid: string
): GraphicResult {
  const checkerId = `chk-${uid}`;
  const glowId = `glow-${uid}`;
  const gradId = `grad-${uid}`;

  if (graphic === "star") {
    const defs = `
      <radialGradient id="${gradId}" cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stop-color="${secondary}" />
        <stop offset="1" stop-color="${primary}" />
      </radialGradient>`;
    const mid = `
      <path d="${starPath(400, 400, 6, 360, 165)}" fill="url(#${gradId})" stroke="${tertiary}" stroke-width="9" />
      <path d="${starPath(400, 400, 6, 330, 150)}" fill="none" stroke="#0a0c0f" stroke-width="2" opacity="0.35" />`;
    return { defs, mid, textFill: "#f4f5f6", textStroke: "#0a0c0f", band: { cx: 400, cy: 400, width: 300, height: 300 } };
  }

  if (graphic === "shield") {
    const defs = `
      <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${primary}" />
        <stop offset="1" stop-color="${tertiary}" />
      </linearGradient>`;
    const path =
      "M130,90 L670,90 Q690,90 690,112 L690,420 Q690,640 400,735 Q110,640 110,420 L110,112 Q110,90 130,90 Z";
    const mid = `
      <path d="${path}" fill="url(#${gradId})" stroke="${secondary}" stroke-width="12" />
      <path d="M155,115 L645,115 Q662,115 662,132 L662,415 Q662,600 400,690 Q138,600 138,415 L138,132 Q138,115 155,115 Z" fill="none" stroke="#f4f5f6" stroke-width="2" opacity="0.35" />`;
    return { defs, mid, textFill: "#f4f5f6", textStroke: "#0a0c0f", band: { cx: 400, cy: 370, width: 460, height: 420 } };
  }

  if (graphic === "bolt") {
    const defs = `
      <filter id="${glowId}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>`;
    const bolt =
      "M480,40 L260,420 L400,420 L280,760 L620,340 L460,340 Z";
    const mid = `
      <rect x="50" y="50" width="700" height="700" rx="22" fill="${primary}" />
      <rect x="50" y="50" width="700" height="700" rx="22" fill="none" stroke="${tertiary}" stroke-width="6" />
      <path d="${bolt}" fill="${secondary}" opacity="0.9" filter="url(#${glowId})" />
      <path d="${bolt}" fill="none" stroke="#0a0c0f" stroke-width="3" opacity="0.5" />`;
    return { defs, mid, textFill: "#f4f5f6", textStroke: "#0a0c0f", band: { cx: 400, cy: 400, width: 560, height: 420 } };
  }

  if (graphic === "spear") {
    const defs = `
      <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${secondary}" />
        <stop offset="1" stop-color="${tertiary}" />
      </linearGradient>`;
    const path = "M190,70 L610,70 L610,400 L470,400 L400,760 L330,400 L190,400 Z";
    const mid = `
      <path d="${path}" fill="url(#${gradId})" stroke="${primary}" stroke-width="10" />
      <line x1="400" y1="400" x2="400" y2="720" stroke="#0a0c0f" stroke-width="2" opacity="0.4" />`;
    return { defs, mid, textFill: "#f4f5f6", textStroke: "#0a0c0f", band: { cx: 400, cy: 235, width: 360, height: 260 } };
  }

  // grid (default): a solid panel with a checkerboard overlay and a bold
  // diagonal color band, the closest to a classic sponsor decal sheet.
  const defs = CHECKER(checkerId);
  const mid = `
    <rect x="55" y="55" width="690" height="690" rx="16" fill="${primary}" />
    <rect x="55" y="55" width="690" height="690" rx="16" fill="url(#${checkerId})" opacity="0.32" />
    <rect x="55" y="55" width="690" height="690" rx="16" fill="none" stroke="${tertiary}" stroke-width="8" />
    <rect x="0" y="352" width="800" height="90" fill="${secondary}" transform="rotate(-5 400 400)" opacity="0.92" />`;
  return { defs, mid, textFill: "#f4f5f6", textStroke: "#0a0c0f", band: { cx: 400, cy: 400, width: 560, height: 460 } };
}

export function buildLiverySVG(opts: LiveryOptions): string {
  const { primary, secondary, tertiary, graphic = "grid", fontId, driverName, carNumber, nameTagStyle = "bar" } = opts;
  const fontFamily = fontStack(fontId ?? "anton");
  const uid = Math.random().toString(36).slice(2, 8);

  const g = buildGraphic(graphic, primary, secondary, tertiary, uid);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    <defs>${g.defs}</defs>
    ${g.mid}
    <g>
      ${renderSponsorBlock(opts.sponsors, primary, secondary, g.textFill, g.textStroke, fontFamily, g.band)}
    </g>
    ${renderNameTag({ driverName, carNumber, style: nameTagStyle, primary, secondary, fontFamily })}
  </svg>`;

  return svg;
}

export function liverySvgDataUri(opts: LiveryOptions): string {
  const svg = buildLiverySVG(opts);
  return `data:image/svg+xml;base64,${toBase64Utf8(svg)}`;
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
