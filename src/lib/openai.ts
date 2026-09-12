import { buildPrompt } from "./prompt";
import { liverySvgDataUri } from "./livery";
import type { DesignRequest, GeneratedDesign } from "./types";

const OPENAI_IMAGES_URL = "https://api.openai.com/v1/images/generations";

/**
 * Turns a customer's rig/color/style choices into a print-ready graphic.
 *
 * Without OPENAI_API_KEY set, this resolves to a locally-built placeholder
 * (see lib/livery.ts) so the design → preview → "send to Printify" flow is
 * fully demoable with zero external accounts. Set the key to switch to real
 * generations via the Images API (gpt-image-1) — no other code changes
 * needed, the response shape is the same either way.
 */
export async function generateDesign(req: DesignRequest): Promise<GeneratedDesign> {
  const prompt = buildPrompt(req);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      imageDataUrl: liverySvgDataUri({
        primary: req.primary,
        secondary: req.secondary,
        text: req.rig,
        tag: req.discipline,
        style: req.style,
        size: 1024,
      }),
      prompt,
      stubbed: true,
      note: "Demo mode — set OPENAI_API_KEY to generate real AI artwork instead of this placeholder.",
    };
  }

  try {
    const res = await fetch(OPENAI_IMAGES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
        background: "transparent",
        n: 1,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`OpenAI Images API ${res.status}: ${body.slice(0, 300)}`);
    }

    const data = (await res.json()) as { data?: Array<{ b64_json?: string }> };
    const b64 = data.data?.[0]?.b64_json;
    if (!b64) throw new Error("OpenAI Images API returned no image data");

    return {
      imageDataUrl: `data:image/png;base64,${b64}`,
      prompt,
      stubbed: false,
    };
  } catch (err) {
    // Never hard-fail the customer's flow because the model call broke —
    // fall back to the placeholder and surface why.
    return {
      imageDataUrl: liverySvgDataUri({
        primary: req.primary,
        secondary: req.secondary,
        text: req.rig,
        tag: req.discipline,
        style: req.style,
        size: 1024,
      }),
      prompt,
      stubbed: true,
      note: `AI generation failed, showing a placeholder instead: ${
        err instanceof Error ? err.message : String(err)
      }`,
    };
  }
}
