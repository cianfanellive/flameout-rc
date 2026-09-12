export type Garment = "tee" | "cap";

export type Discipline =
  | "buggy"
  | "truck"
  | "drift"
  | "crawler"
  | "drone"
  | "nitro";

export type DesignStyle = "flame" | "neon" | "carbon" | "checkered" | "retro";

export interface DesignRequest {
  garment: Garment;
  discipline: Discipline;
  rig: string;
  primary: string;
  secondary: string;
  style: DesignStyle;
  details?: string;
}

export interface GeneratedDesign {
  imageDataUrl: string;
  prompt: string;
  stubbed: boolean;
  note?: string;
}

export interface PrintifyCreateResult {
  stubbed: boolean;
  productId?: string;
  note: string;
  wouldCreate?: Record<string, unknown>;
}

export const DISCIPLINE_LABEL: Record<Discipline, string> = {
  buggy: "1:10 Buggy",
  truck: "Short Course Truck",
  drift: "RC Drift",
  crawler: "Rock Crawler",
  drone: "FPV Drone",
  nitro: "Nitro On-Road",
};

export const STYLE_LABEL: Record<DesignStyle, string> = {
  flame: "Flame Wrap",
  neon: "Neon Circuit",
  carbon: "Carbon Tactical",
  checkered: "Checkered Flag",
  retro: "Retro Livery",
};
