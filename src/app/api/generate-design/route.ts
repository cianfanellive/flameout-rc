import { NextResponse } from "next/server";
import { generateDesign } from "@/lib/openai";
import type { DesignRequest, Discipline, DesignStyle, Garment } from "@/lib/types";

// Required by @cloudflare/next-on-pages: Cloudflare Pages Functions run on
// Workers, not Node, so every dynamic route needs the edge runtime.
export const runtime = "edge";

const GARMENTS: Garment[] = ["tee", "cap"];
const DISCIPLINES: Discipline[] = [
  "buggy",
  "truck",
  "drift",
  "crawler",
  "drone",
  "nitro",
];
const STYLES: DesignStyle[] = ["flame", "neon", "carbon", "checkered", "retro"];

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function parseBody(body: unknown): DesignRequest | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const garment = b.garment as Garment;
  const discipline = b.discipline as Discipline;
  const style = b.style as DesignStyle;
  const primary = b.primary as string;
  const secondary = b.secondary as string;
  const rig = typeof b.rig === "string" ? b.rig : "";
  const details = typeof b.details === "string" ? b.details : undefined;

  if (!GARMENTS.includes(garment)) return null;
  if (!DISCIPLINES.includes(discipline)) return null;
  if (!STYLES.includes(style)) return null;
  if (typeof primary !== "string" || !HEX_RE.test(primary)) return null;
  if (typeof secondary !== "string" || !HEX_RE.test(secondary)) return null;
  if (!rig.trim()) return null;
  if (rig.length > 40) return null;
  if (details && details.length > 300) return null;

  return { garment, discipline, style, primary, secondary, rig, details };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const req = parseBody(body);
  if (!req) {
    return NextResponse.json(
      { error: "Missing or invalid fields. Check garment, discipline, style, rig, and primary/secondary hex colors." },
      { status: 400 }
    );
  }

  const result = await generateDesign(req);
  return NextResponse.json(result);
}
