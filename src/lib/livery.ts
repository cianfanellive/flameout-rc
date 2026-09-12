// Deterministic, layout-based "sponsor board" graphic generator.
//
// This is the actual design engine, not a placeholder for something AI
// would otherwise produce. Given the sponsors (typed brand names and/or
// uploaded logo images), colors, font, style, and name tag a customer
// picks, it renders a print-ready graphic entirely from typography and
// vector shapes: checkered corners, carbon plate, neon lines, flame glow,
// or retro stripes as background, sponsors stacked as a real pit-lane
// livery would show them.
//
// Runs identically in the browser (live preview as the customer picks
// options) and on the server, pure functions, no Node-only APIs.

import { fontStack } from "./fonts";

export type LiveryStyle = "flame" | "neon" | "carbon" | "checkered" | "retro";
export type NameTagStyle = "bar" | "outline" | "badge";

export type SponsorItem = { kind: "text"; label: string } | { kind: "image"; dataUrl: string };

export interface LiveryOptions {
  primary: string;
  secondary: string;
  /** 1-5 sponsors, in the order the customer added them. */
  sponsors: SponsorItem[];
  fontId?: string;
  driverName?: string;
  carNumber?: string;
  nameTagStyle?: NameTagStyle;
  style?: LiveryStyle;
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

// Wide fixed-width text at a single font size clips or overflows once a
// sponsor name runs long, so scale down in tiers instead of guessing one.
function fitFontSize(text: string): number {
  const len = text.length;
  if (len <= 6) return 92;
  if (len <= 9) return 76;
  if (len <= 12) return 60;
  if (len <= 16) return 48;
  return 38;
}

const CHECKER = (id: string) => `
  <pattern id="${id}" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="18" height="18" fill="#0a0c0f" />
    <rect width="9" height="9" fill="#f4f5f6" />
    <rect x="9" y="9" width="9" height="9" fill="#f4f5f6" />
  </pattern>`;

const CARBON = (id: string, base: string) => `
  <pattern id="${id}" width="10" height="10" patternUnits="userSpaceOnUse">
    <rect width="10" height="10" fill="${base}" />
    <path d="M0 0h5v5H0zM5 5h5v5H5z" fill="rgba(255,255,255,0.06)" />
  </pattern>`;

const FLAME_PATH =
  "M120 8c8 26-6 42-22 60-24 26-50 56-50 96 0 38 30 68 68 68 5 0 10-1 14-2-9-8-15-19-15-32 0-24 18-36 32-50 2 12 8 20 16 30 12 14 25 29 25 51 0 38-30 68-68 68-64 0-114-50-114-118 0-72 52-112 88-148 8-8 14-16 26-23z";

// A logo image sponsor gets a colored frame instead of floating as a bare
// raster on the canvas, so it visibly picks up the customer's chosen
// palette even though the pixels inside aren't recolored.
function imageChip(dataUrl: string, x: number, y: number, w: number, h: number, primary: string, secondary: string): string {
  const pad = w * 0.1;
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#0a0c0f" stroke="${primary}" stroke-width="4" />
    <rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="7" fill="none" stroke="${secondary}" stroke-width="1.5" opacity="0.85" />
    <image href="${dataUrl}" x="${x + pad}" y="${y + pad}" width="${w - pad * 2}" height="${h - pad * 2}" preserveAspectRatio="xMidYMid meet" />`;
}

// A single sponsor reads as a big centered mark; 2+ reads as a stacked
// sponsor-panel board (a real RC pit-lane livery), alternating primary/
// secondary text so each name reads as its own "sticker."
function renderSponsorBlock(
  sponsors: SponsorItem[],
  primary: string,
  secondary: string,
  textFill: string,
  textStroke: string,
  fontFamily: string
): string {
  const items = sponsors.length ? sponsors.slice(0, 5) : [{ kind: "text", label: "YOUR SPONSOR" } as const];

  if (items.length === 1) {
    const item = items[0];
    if (item.kind === "image") {
      return imageChip(item.dataUrl, 240, 240, 320, 320, primary, secondary);
    }
    const t = fitText(item.label);
    const safe = escapeXml(t.toUpperCase());
    return `<text x="400" y="580" text-anchor="middle" font-family="${fontFamily}" font-size="${fitFontSize(
      t
    )}" letter-spacing="2" fill="${textFill}" stroke="${textStroke}" stroke-width="2" paint-order="stroke">${safe}</text>`;
  }

  const fontSize = items.length <= 3 ? 54 : items.length === 4 ? 46 : 40;
  const rowHeight = fontSize * 1.45;
  const totalHeight = rowHeight * (items.length - 1);
  const startY = 560 - totalHeight / 2;

  return items
    .map((item, i) => {
      const y = startY + i * rowHeight;
      if (item.kind === "image") {
        const box = fontSize * 1.7;
        return imageChip(item.dataUrl, 400 - box / 2, y - box * 0.72, box, box, primary, secondary);
      }
      const t = fitText(item.label, 18);
      const safe = escapeXml(t.toUpperCase());
      const fill = i % 2 === 0 ? textFill : secondary;
      const markerFill = i % 2 === 0 ? secondary : primary;
      return `
        <rect x="228" y="${y - fontSize * 0.72}" width="10" height="10" fill="${markerFill}" transform="rotate(45 233 ${
        y - fontSize * 0.67
      })" />
        <text x="400" y="${y}" text-anchor="middle" font-family="${fontFamily}" font-size="${fontSize}" letter-spacing="1.5" fill="${fill}" stroke="${textStroke}" stroke-width="1.4" paint-order="stroke">${safe}</text>`;
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
  const baseline = 752;

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

export function buildLiverySVG(opts: LiveryOptions): string {
  const {
    primary,
    secondary,
    style = "flame",
    fontId,
    driverName,
    carNumber,
    nameTagStyle = "bar",
  } = opts;
  const fontFamily = fontStack(fontId ?? "anton");
  const uid = Math.random().toString(36).slice(2, 8);

  const checkerId = `chk-${uid}`;
  const carbonId = `crb-${uid}`;
  const glowId = `glow-${uid}`;

  const defs = `
    <defs>
      ${CHECKER(checkerId)}
      ${CARBON(carbonId, "#101216")}
      <filter id="${glowId}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="10" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <radialGradient id="glow-bg-${uid}" cx="0.42" cy="0.4" r="0.5">
        <stop offset="0" stop-color="${secondary}" stop-opacity="0.45" />
        <stop offset="1" stop-color="${secondary}" stop-opacity="0" />
      </radialGradient>
    </defs>`;

  let mid = "";
  let textFill = "#f4f5f6";
  let textStroke = primary;

  if (style === "checkered") {
    mid = `
      <polygon points="0,0 340,0 0,340" fill="url(#${checkerId})" opacity="0.9" />
      <polygon points="800,800 460,800 800,460" fill="url(#${checkerId})" opacity="0.9" />
      <rect x="0" y="352" width="800" height="96" fill="${secondary}" transform="rotate(-6 400 400)" />`;
  } else if (style === "carbon") {
    mid = `
      <rect x="40" y="40" width="720" height="720" rx="18" fill="url(#${carbonId})" />
      <rect x="40" y="40" width="720" height="720" rx="18" fill="none" stroke="${primary}" stroke-width="6" />
      <rect x="64" y="64" width="672" height="8" fill="${primary}" opacity="0.8" />
      <rect x="64" y="728" width="672" height="8" fill="${primary}" opacity="0.8" />`;
    textFill = primary;
    textStroke = "transparent";
  } else if (style === "neon") {
    mid = `
      <rect width="800" height="800" fill="#070809" />
      ${Array.from({ length: 5 })
        .map(
          (_, i) =>
            `<line x1="${-100 + i * 60}" y1="800" x2="${300 + i * 60}" y2="0" stroke="${
              i % 2 === 0 ? primary : secondary
            }" stroke-width="3" opacity="${0.5 - i * 0.07}" />`
        )
        .join("")}
      <circle cx="400" cy="400" r="230" fill="none" stroke="${secondary}" stroke-width="3" opacity="0.55" filter="url(#${glowId})" />`;
    textFill = "#f4f5f6";
    textStroke = secondary;
  } else if (style === "retro") {
    mid = `
      <rect y="260" width="800" height="130" fill="${primary}" transform="skewY(-4)" />
      <rect y="410" width="800" height="46" fill="${secondary}" transform="skewY(-4)" />
      <circle cx="400" cy="400" r="270" fill="none" stroke="#f4f5f6" stroke-width="4" opacity="0.25" />`;
  } else {
    // flame (default): transparent canvas apart from a soft glow behind
    // the mark, so it reads as a direct print rather than a printed box.
    mid = `
      <rect width="800" height="800" fill="url(#glow-bg-${uid})" />
      <g transform="translate(210,150) scale(2.5)" filter="url(#${glowId})">
        <path d="${FLAME_PATH}" fill="${primary}" opacity="0.9" />
      </g>
      <g transform="translate(210,150) scale(2.5)">
        <path d="${FLAME_PATH}" fill="${secondary}" opacity="0.55" />
      </g>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    ${defs}
    <rect width="800" height="800" fill="none" />
    ${mid}
    <g>
      ${renderSponsorBlock(opts.sponsors, primary, secondary, textFill, textStroke, fontFamily)}
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
