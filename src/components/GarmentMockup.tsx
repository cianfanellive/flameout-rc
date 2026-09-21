import type { ReactNode } from "react";

type Garment = "tee" | "cap";
type View = "front" | "back";

// Approximate swatch colors for 5 real Comfort Colors 1717 colorways
// (garment-dyed, so these read a little muted/heathered rather than pure
// hues, that's intentional, it's how the actual blank looks).
export const SHIRT_COLORS = {
  black: { label: "Black", hex: "#1b1b1b" },
  white: { label: "White", hex: "#f1f1ec" },
  navy: { label: "True Navy", hex: "#232f3d" },
  red: { label: "Crimson", hex: "#a2383e" },
  grey: { label: "Granite", hex: "#8a8983" },
} as const;

export type ShirtColorId = keyof typeof SHIRT_COLORS;

// Real product photography, front and back, per shirt color. Empty until
// real Comfort Colors 1717 photos (or AI-generated stand-ins) are dropped
// into public/shirts/ as `${colorId}-front.jpg` / `${colorId}-back.jpg` —
// GarmentMockup falls back to the flat vector illustration for any color
// that isn't in here yet, so the site never breaks waiting on a photo.
const SHIRT_PHOTOS: Partial<Record<ShirtColorId, { front: string; back: string }>> = {};

// Where the printable area sits within the photo, as a percentage box.
// Tuned for a centered, front-facing flat-lay/ghost-mannequin product
// shot, adjust per photo once the real images are in if they're framed
// differently.
const PHOTO_PRINT_AREA = {
  front: { left: "32%", top: "24%", width: "36%", height: "30%" },
  back: { left: "30%", top: "16%", width: "40%", height: "34%" },
};

export function GarmentMockup({
  garment,
  garmentColor = "black",
  view = "front",
  children,
  label,
}: {
  garment: Garment;
  garmentColor?: ShirtColorId;
  view?: View;
  children?: ReactNode;
  label?: string;
}) {
  const fill = SHIRT_COLORS[garmentColor]?.hex ?? SHIRT_COLORS.black.hex;
  const photo = garment === "tee" ? SHIRT_PHOTOS[garmentColor] : undefined;

  if (photo) {
    const src = view === "back" ? photo.back : photo.front;
    const area = PHOTO_PRINT_AREA[view];
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={`${SHIRT_COLORS[garmentColor].label} tee, ${view}`} className="h-full w-full object-cover" />
        <div className="absolute overflow-hidden" style={area}>
          {children}
        </div>
        {label ? (
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-display text-[10px] uppercase tracking-widest text-asphalt-900/70">
            {label}
          </span>
        ) : null}
      </div>
    );
  }

  if (garment === "cap") {
    return (
      <div className="relative aspect-[6/5] w-full">
        <svg viewBox="0 0 220 180" className="h-full w-full">
          <path
            d="M18 118c4-34 34-62 92-62s88 28 92 62c1 7-4 12-11 12H29c-7 0-12-5-11-12z"
            fill={fill}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.5"
          />
          <path d="M110 56v62" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          <path
            d="M8 128c30 10 70 15 102 15s72-5 102-15l6 12c-32 12-74 18-108 18s-76-6-108-18z"
            fill="rgba(0,0,0,0.35)"
          />
        </svg>
        <div
          className="absolute overflow-hidden rounded-[6px]"
          style={{ left: "20%", top: "20%", width: "60%", height: "64%", transform: "rotate(-1deg)" }}
        >
          {children}
        </div>
        {label ? (
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-display text-[10px] uppercase tracking-widest text-chrome-400/70">
            {label}
          </span>
        ) : null}
      </div>
    );
  }

  // Flat vector fallback, used until a real photo exists for this color.
  return (
    <div className="relative aspect-[4/5] w-full">
      <svg viewBox="0 0 200 240" className="h-full w-full">
        {view === "back" ? (
          <path
            d="M64 8 38 24 10 54l22 24 14-10v144a6 6 0 0 0 6 6h96a6 6 0 0 0 6-6V68l14 10 22-24-28-30-26-16c-3 8-13 14-26 14s-23-6-26-14z"
            fill={fill}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.5"
          />
        ) : (
          <>
            <path
              d="M64 8 38 24 10 54l22 24 14-10v144a6 6 0 0 0 6 6h96a6 6 0 0 0 6-6V68l14 10 22-24-28-30-26-16c-6 7-16 12-26 12s-20-5-26-12z"
              fill={fill}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1.5"
            />
            <path d="M64 8c6 7 16 12 26 12s20-5 26-12" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          </>
        )}
      </svg>
      <div
        className="absolute overflow-hidden rounded-[4px]"
        style={{ left: "10%", top: "13%", width: "80%", height: "68%", transform: "rotate(-0.5deg)" }}
      >
        {children}
      </div>
      {label ? (
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-display text-[10px] uppercase tracking-widest text-chrome-400/70">
          {label}
        </span>
      ) : null}
    </div>
  );
}
