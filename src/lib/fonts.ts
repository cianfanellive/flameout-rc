// Curated set of display fonts for sponsor text and the name tag. All are
// real Google Fonts, loaded once (see the stylesheet link in layout.tsx)
// and referenced here by exact family name so lib/livery.ts can set them
// directly as SVG font-family. Picked for range: motorsport stencil/block
// faces, tech/telemetry faces, script/marker faces, and a couple of clean
// fallbacks, since Printify's own personalization tool draws from the same
// pool of widely-available web fonts.
export interface FontOption {
  id: string;
  label: string;
  family: string;
  weight: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { id: "anton", label: "Anton", family: "Anton", weight: "400" },
  { id: "bebas", label: "Bebas Neue", family: "Bebas Neue", weight: "400" },
  { id: "oswald", label: "Oswald", family: "Oswald", weight: "700" },
  { id: "racing", label: "Racing Sans One", family: "Racing Sans One", weight: "400" },
  { id: "bangers", label: "Bangers", family: "Bangers", weight: "400" },
  { id: "righteous", label: "Righteous", family: "Righteous", weight: "400" },
  { id: "archivo", label: "Archivo Black", family: "Archivo Black", weight: "400" },
  { id: "alfa", label: "Alfa Slab One", family: "Alfa Slab One", weight: "400" },
  { id: "russo", label: "Russo One", family: "Russo One", weight: "400" },
  { id: "teko", label: "Teko", family: "Teko", weight: "700" },
  { id: "squada", label: "Squada One", family: "Squada One", weight: "400" },
  { id: "staatliches", label: "Staatliches", family: "Staatliches", weight: "400" },
  { id: "blackops", label: "Black Ops One", family: "Black Ops One", weight: "400" },
  { id: "rubikmono", label: "Rubik Mono One", family: "Rubik Mono One", weight: "400" },
  { id: "orbitron", label: "Orbitron", family: "Orbitron", weight: "700" },
  { id: "marker", label: "Permanent Marker", family: "Permanent Marker", weight: "400" },
  { id: "pacifico", label: "Pacifico", family: "Pacifico", weight: "400" },
  { id: "lobster", label: "Lobster", family: "Lobster", weight: "400" },
  { id: "montserrat", label: "Montserrat", family: "Montserrat", weight: "800" },
  { id: "barlow", label: "Barlow Condensed", family: "Barlow Condensed", weight: "700" },
];

export const DEFAULT_FONT_ID = "anton";

export function fontStack(id: string): string {
  const f = FONT_OPTIONS.find((x) => x.id === id) ?? FONT_OPTIONS[0];
  return `'${f.family}', Arial Black, Impact, sans-serif`;
}

// One combined request to the Google Fonts CSS2 API for every family/weight
// above, loaded once in layout.tsx. Building it here keeps the font list
// and the stylesheet URL from drifting apart.
export function googleFontsHref(): string {
  const families = FONT_OPTIONS.map(
    (f) => `family=${f.family.replace(/ /g, "+")}:wght@${f.weight}`
  ).join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
