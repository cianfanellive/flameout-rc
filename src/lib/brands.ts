// Curated RC manufacturer names offered in the sponsor picker. Customers
// can also upload their own logo image instead (see lib/livery.ts's
// SponsorItem type) up to MAX_SPONSORS total, see lib/pricing.ts for how
// extras are priced. See README.md for why brand names are set in
// typography, not reproduced logos: real manufacturer trademarks, used
// here nominatively (identifying whose rig the shirt is for) rather than
// as licensed/official merch.
export const RC_BRANDS = [
  "Traxxas",
  "Team Associated",
  "Losi",
  "ARRMA",
  "Axial",
  "Redcat Racing",
  "TLR",
  "HPI Racing",
  "Kyosho",
  "Tekno RC",
  "Team Corally",
  "Team Durango",
  "Mugen Seiki",
  "Yokomo",
  "Vaterra",
  "ECX",
  "Pro-Line",
  "JConcepts",
  "Xray",
  "Schumacher",
  "FTX",
  "Carisma",
  "MST",
  "SWorkz",
] as const;

export type RcBrand = (typeof RC_BRANDS)[number];
