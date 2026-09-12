// Deterministic, layout-based "sponsor board" graphic generator.
//
// This is the actual design engine — not a placeholder for something AI
// would otherwise produce. Given the RC brand names, colors, and style a
// customer picks, it renders a print-ready graphic entirely from typography
// and vector shapes (checkered corners, carbon plate, neon lines, flame
// glow, retro stripes). No photos, no logos, no AI model in the loop —
// which is also why it's safe to run: it's brand *names* set in a bold
// display face, never a manufacturer's actual trademarked artwork.
//
// Runs identically in the browser (live preview as the customer picks
// options) and on the server (Printify product creation) — pure functions,
// no Node-only APIs.

export type LiveryStyle = "flame" | "neon" | "carbon" | "checkered" | "retro";

export interface LiveryOptions {
  primary: string;
  secondary: string;
  /** 1-5 RC brand names, in the order the customer picked them. */
  brands: string[];
  tag?: string;
  style?: LiveryStyle;
  size?: number;
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
// brand name runs long, so scale down in tiers instead of guessing one size.
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

// A single brand reads as a big centered wordmark; 2+ reads as a stacked
// sponsor-panel board (exactly what a real RC pit-lane livery looks like),
// alternating primary/secondary per line so each name reads as its own
// "sticker" rather than a wall of same-colored text.
function renderBrandBlock(
  brands: string[],
  primary: string,
  secondary: string,
  textFill: string,
  textStroke: string
): string {
  const names = (brands.length ? brands : ["YOUR BRAND"]).slice(0, 5);

  if (names.length === 1) {
    const t = fitText(names[0]);
    const safe = escapeXml(t.toUpperCase());
    return `<text x="400" y="580" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="${fitFontSize(
      t
    )}" letter-spacing="2" fill="${textFill}" stroke="${textStroke}" stroke-width="2" paint-order="stroke">${safe}</text>`;
  }

  const fontSize = names.length <= 3 ? 54 : names.length === 4 ? 46 : 40;
  const gap = fontSize * 1.45;
  const totalHeight = gap * (names.length - 1);
  const startY = 560 - totalHeight / 2;

  return names
    .map((raw, i) => {
      const t = fitText(raw, 18);
      const safe = escapeXml(t.toUpperCase());
      const fill = i % 2 === 0 ? textFill : secondary;
      const markerFill = i % 2 === 0 ? secondary : primary;
      const y = startY + i * gap;
      return `
        <rect x="228" y="${y - fontSize * 0.72}" width="10" height="10" fill="${markerFill}" transform="rotate(45 233 ${
        y - fontSize * 0.67
      })" />
        <text x="400" y="${y}" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="${fontSize}" letter-spacing="1.5" fill="${fill}" stroke="${textStroke}" stroke-width="1.4" paint-order="stroke">${safe}</text>`;
    })
    .join("");
}

export function buildLiverySVG(opts: LiveryOptions): string {
  const { primary, secondary, tag = "", style = "flame", size = 800 } = opts;
  const safeTag = escapeXml(tag.toUpperCase());
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
    // flame (default) — transparent canvas apart from a soft glow behind
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

  const tagPill = safeTag
    ? `
      <g transform="translate(56,644)">
        <rect width="${Math.max(140, safeTag.length * 15)}" height="38" rx="4" fill="#0a0c0f" opacity="0.8" />
        <text x="14" y="26" font-family="Arial Black, Impact, sans-serif" font-size="17" letter-spacing="2" fill="${secondary}">${safeTag}</text>
      </g>`
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="${size}" height="${size}">
    ${defs}
    <rect width="800" height="800" fill="none" />
    ${mid}
    <g>
      ${renderBrandBlock(opts.brands, primary, secondary, textFill, textStroke)}
    </g>
    ${tagPill}
  </svg>`;

  return svg;
}

export function liverySvgDataUri(opts: LiveryOptions): string {
  const svg = buildLiverySVG(opts);
  return `data:image/svg+xml;base64,${toBase64Utf8(svg)}`;
}

// Works identically under Node (local dev/build), the browser (client-side
// live preview), and the Workers edge runtime (Cloudflare Pages) — plain
// `btoa` only handles Latin1, so we widen each byte through TextEncoder
// first rather than reaching for the Node-only `Buffer`.
function toBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
