import { DISCIPLINE_LABEL, STYLE_LABEL, type DesignRequest } from "./types";

/**
 * Builds the image-generation prompt from a customer's choices.
 *
 * The trademark guardrail near the end is deliberate and load-bearing: the
 * whole pitch of this store is personalization by *description* (rig name,
 * colors, discipline), not by reproducing a manufacturer's actual logo or a
 * real team's registered livery. Keep that line in any prompt you send to
 * an image model if you change this.
 */
export function buildPrompt(req: DesignRequest): string {
  const discipline = DISCIPLINE_LABEL[req.discipline];
  const style = STYLE_LABEL[req.style];
  const rig = req.rig.trim() || "an RC racer";

  const lines = [
    `A bold, high-contrast graphic-tee livery design for RC ${discipline.toLowerCase()} apparel, in a "${style}" style.`,
    `Primary color ${req.primary}, secondary/accent color ${req.secondary}.`,
    `Work the text or initials "${rig}" into the composition as part of the graphic, race-number or stenciled sponsor-panel style — not a plain caption.`,
    "Motorsport / RC-livery aesthetic: checkered-flag or carbon-fiber accents, speed lines, panel stripes, badge or number-plate shapes. Flat vector illustration, screen-print / DTG ready, centered composition, transparent background, no photorealism, no drop shadows, no mockup, no text watermark.",
    "Do not depict or imitate any real manufacturer logo, trademark, or an existing team's registered livery — this is original artwork inspired by the rig described above, not a reproduction.",
  ];

  if (req.details?.trim()) {
    lines.push(`Additional direction from the customer: ${req.details.trim()}`);
  }

  return lines.join(" ");
}
