export type Garment = "tee" | "cap";

export type DesignStyle = "flame" | "neon" | "carbon" | "checkered" | "retro";

export interface PrintifyCreateResult {
  stubbed: boolean;
  productId?: string;
  note: string;
  wouldCreate?: Record<string, unknown>;
}

export const STYLE_LABEL: Record<DesignStyle, string> = {
  flame: "Flame Wrap",
  neon: "Neon Circuit",
  carbon: "Carbon Tactical",
  checkered: "Checkered Flag",
  retro: "Retro Livery",
};
