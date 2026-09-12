import { NextResponse } from "next/server";
import { createPrintifyProduct } from "@/lib/printify";
import { MAX_SPONSORS } from "@/lib/pricing";
import type { Garment } from "@/lib/types";

// Required by @cloudflare/next-on-pages: Cloudflare Pages Functions run on
// Workers, not Node.
export const runtime = "edge";

const GARMENTS: Garment[] = ["tee", "cap"];

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const garment = b.garment as Garment;
  const title = typeof b.title === "string" ? b.title.slice(0, 120) : "";
  const imageDataUrl = typeof b.imageDataUrl === "string" ? b.imageDataUrl : "";
  const shirtColor = typeof b.shirtColor === "string" ? b.shirtColor.slice(0, 40) : undefined;
  const size = typeof b.size === "string" ? b.size.slice(0, 10) : undefined;
  const sponsorLabels = Array.isArray(b.sponsorLabels)
    ? b.sponsorLabels.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    : [];
  const sponsorCount =
    typeof b.sponsorCount === "number" && Number.isFinite(b.sponsorCount)
      ? Math.round(b.sponsorCount)
      : sponsorLabels.length;

  if (
    !GARMENTS.includes(garment) ||
    !title.trim() ||
    !imageDataUrl.startsWith("data:image") ||
    sponsorCount < 1 ||
    sponsorCount > MAX_SPONSORS
  ) {
    return NextResponse.json(
      {
        error: `Missing or invalid fields. Need garment, a title, an imageDataUrl, and 1 to ${MAX_SPONSORS} sponsors.`,
      },
      { status: 400 }
    );
  }

  const result = await createPrintifyProduct({
    garment,
    sponsorCount,
    sponsorLabels,
    shirtColor,
    size,
    title,
    imageDataUrl,
  });
  return NextResponse.json(result);
}
