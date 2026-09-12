import { NextResponse } from "next/server";
import { createPrintifyProduct } from "@/lib/printify";
import type { Garment } from "@/lib/types";

// Required by @cloudflare/next-on-pages — see generate-design/route.ts.
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

  if (!GARMENTS.includes(garment) || !title.trim() || !imageDataUrl.startsWith("data:image")) {
    return NextResponse.json(
      { error: "Missing or invalid fields. Need garment, title, and an imageDataUrl from /api/generate-design." },
      { status: 400 }
    );
  }

  const result = await createPrintifyProduct({ garment, title, imageDataUrl });
  return NextResponse.json(result);
}
