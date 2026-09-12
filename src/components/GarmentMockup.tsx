import type { ReactNode } from "react";

type Garment = "tee" | "cap";

const GARMENT_FILL: Record<string, string> = {
  black: "#15171b",
  charcoal: "#2b2e34",
  white: "#eceeef",
};

export function GarmentMockup({
  garment,
  garmentColor = "black",
  children,
  label,
}: {
  garment: Garment;
  garmentColor?: keyof typeof GARMENT_FILL;
  children?: ReactNode;
  label?: string;
}) {
  const fill = GARMENT_FILL[garmentColor] ?? GARMENT_FILL.black;

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
          <path
            d="M110 56v62"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.5"
          />
          <path
            d="M8 128c30 10 70 15 102 15s72-5 102-15l6 12c-32 12-74 18-108 18s-76-6-108-18z"
            fill="rgba(0,0,0,0.35)"
          />
        </svg>
        <div
          className="absolute overflow-hidden rounded-[6px]"
          style={{
            left: "35%",
            top: "36%",
            width: "30%",
            height: "32%",
            transform: "rotate(-1deg)",
          }}
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

  return (
    <div className="relative aspect-[4/5] w-full">
      <svg viewBox="0 0 200 240" className="h-full w-full">
        <path
          d="M64 8 38 24 10 54l22 24 14-10v144a6 6 0 0 0 6 6h96a6 6 0 0 0 6-6V68l14 10 22-24-28-30-26-16c-6 7-16 12-26 12s-20-5-26-12z"
          fill={fill}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
        />
        <path
          d="M64 8c6 7 16 12 26 12s20-5 26-12"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />
      </svg>
      <div
        className="absolute overflow-hidden rounded-[4px]"
        style={{
          left: "30%",
          top: "30%",
          width: "40%",
          height: "34%",
          transform: "rotate(-0.5deg)",
        }}
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
