// Curated RC manufacturer names offered in the brand picker. Customers pick
// up to MAX_BRANDS of these — see lib/pricing.ts for how extras are priced,
// and README.md for why this is names set in typography, not reproduced
// logos: real manufacturer trademarks, used here nominatively (identifying
// whose rig the shirt is for) rather than as licensed/official merch.
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
