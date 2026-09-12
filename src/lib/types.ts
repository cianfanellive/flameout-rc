export type Garment = "tee" | "cap";

export interface PrintifyCreateResult {
  stubbed: boolean;
  productId?: string;
  note: string;
  wouldCreate?: Record<string, unknown>;
}
