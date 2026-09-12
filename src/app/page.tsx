import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { GarmentMockup } from "@/components/GarmentMockup";
import { liverySvgDataUri, type LiveryStyle } from "@/lib/livery";
import { EXTRA_BRAND_PRICE_CENTS, formatUsd, MAX_BRANDS } from "@/lib/pricing";
import {
  BoltIcon,
  CheckeredFlagIcon,
  FlameMark,
  GaugeIcon,
  ShirtIcon,
  TruckIcon,
} from "@/components/icons";

const STEPS = [
  {
    icon: GaugeIcon,
    title: "Pick your brands",
    body: "Choose your rig's brand from the dropdown — Traxxas, ARRMA, Losi, and more. Add up to 5; each one past the first is +$5.",
  },
  {
    icon: BoltIcon,
    title: "Dial in your colors",
    body: "Pick a primary and secondary color and a livery style. The design updates live as you go — no waiting, no generating.",
  },
  {
    icon: ShirtIcon,
    title: "See it on the shirt",
    body: "Step two shows the full tee or cap mockup with your design on it, plus the exact price before you commit to anything.",
  },
  {
    icon: TruckIcon,
    title: "We print & ship",
    body: "Printify handles production and shipping on demand — no warehouse, no minimums, no waiting on a batch run.",
  },
];

const FEATURES = [
  {
    title: "You're in control",
    body: "No AI improvising your design — you pick the exact brands, colors, and layout, and see precisely what you'll get.",
  },
  {
    title: "Print-on-demand",
    body: "Nothing gets made until you order it. No dead stock, no clearance bin, no waste.",
  },
  {
    title: "Real blanks, real choice",
    body: "Gildan Heavy Cotton or Comfort Colors for tees — pick the weight and feel, the price adjusts to match.",
  },
  {
    title: "Typography, not bootleg logos",
    body: "Brand names are set in our own display type, never traced manufacturer artwork — see the footer for the full note.",
  },
];

const SHOWCASE: Array<{
  garment: "tee" | "cap";
  discipline: string;
  brands: string[];
  primary: string;
  secondary: string;
  style: LiveryStyle;
  garmentColor: "black" | "charcoal" | "white";
}> = [
  { garment: "tee", discipline: "1:10 BUGGY", brands: ["Traxxas"], primary: "#ff5a1f", secondary: "#ffc400", style: "flame", garmentColor: "black" },
  { garment: "cap", discipline: "SHORT COURSE TRUCK", brands: ["Team Associated", "Losi"], primary: "#ff2d2d", secondary: "#0a0c0f", style: "checkered", garmentColor: "black" },
  { garment: "tee", discipline: "RC DRIFT", brands: ["ARRMA"], primary: "#7dd3fc", secondary: "#ff2d2d", style: "neon", garmentColor: "charcoal" },
  { garment: "cap", discipline: "ROCK CRAWLER", brands: ["Axial"], primary: "#c9ccd1", secondary: "#5b6470", style: "carbon", garmentColor: "black" },
  { garment: "tee", discipline: "FPV DRONE", brands: ["Redcat Racing", "Pro-Line", "JConcepts"], primary: "#ffd23f", secondary: "#ff5a1f", style: "retro", garmentColor: "charcoal" },
  { garment: "cap", discipline: "NITRO ON-ROAD", brands: ["Kyosho"], primary: "#ff8a3d", secondary: "#ffc400", style: "flame", garmentColor: "charcoal" },
];

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10 bg-asphalt-900">
        <div className="stripes absolute inset-0" />
        <div className="asphalt-texture absolute inset-0" />
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-flame-500 to-transparent" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-sm border border-flame-500/40 bg-flame-500/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-flame-400">
              <CheckeredFlagIcon className="h-4 w-4" />
              Pick your brands · Print-on-demand
            </span>
            <h1 className="font-display text-5xl font-bold uppercase leading-[0.98] tracking-tight text-chrome-300 sm:text-6xl md:text-7xl">
              Design your
              <br />
              <span className="text-flame-500">ride.</span> Wear your
              <br />
              <span className="text-stroke">rig.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-chrome-400">
              Pick up to {MAX_BRANDS} RC brands, your colors, and a livery
              style. See it update live, then see it on the shirt — printed
              one-off on a tee or snapback, no minimums.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/design"
                className="rounded-sm bg-flame-500 px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-asphalt-950 shadow-glow transition hover:bg-flame-400"
              >
                Start Your Design →
              </Link>
              <Link
                href="#how-it-works"
                className="rounded-sm border border-white/15 px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-chrome-300 transition hover:border-flame-500/50 hover:text-flame-400"
              >
                How It Works
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
              {[
                ["Live", "instant preview"],
                [`${MAX_BRANDS}`, "brands, max"],
                ["2", "garments: tee + cap"],
                [`+${formatUsd(EXTRA_BRAND_PRICE_CENTS)}`, "per extra brand"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl font-bold text-flame-400">{value}</dt>
                  <dd className="text-xs uppercase tracking-wide text-chrome-400/80">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto flex w-full max-w-sm items-center justify-center">
            <div className="w-[68%] rotate-[3deg] drop-shadow-2xl">
              <GarmentMockup garment="tee" garmentColor="black">
                <LiveryImg
                  primary="#ff5a1f"
                  secondary="#ffc400"
                  brands={["Traxxas"]}
                  tag="1:10 BUGGY"
                  style="flame"
                />
              </GarmentMockup>
            </div>
            <div className="absolute -bottom-4 -left-2 w-[42%] -rotate-[6deg] drop-shadow-2xl">
              <GarmentMockup garment="cap" garmentColor="charcoal">
                <LiveryImg
                  primary="#ff2d2d"
                  secondary="#0a0c0f"
                  brands={["Team Associated", "Losi"]}
                  tag=""
                  style="checkered"
                />
              </GarmentMockup>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="border-b border-white/10 bg-asphalt-950 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading eyebrow="The Flow" title="From pit box to print in four steps" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="asphalt-texture group relative rounded-md border border-white/10 bg-asphalt-800 p-6 shadow-panel transition hover:border-flame-500/40"
              >
                <span className="font-display text-5xl font-bold text-white/5">
                  0{i + 1}
                </span>
                <step.icon className="mt-2 h-7 w-7 text-flame-500" />
                <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-wide text-chrome-300">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-chrome-400">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section className="stripes-thick border-b border-white/10 bg-asphalt-900 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading eyebrow="Built Different" title="Not another blank-tee dropship store" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4 rounded-md border border-white/10 bg-asphalt-950/60 p-5">
                <FlameMark className="mt-1 h-5 w-5 flex-shrink-0 text-flame-500" />
                <div>
                  <h3 className="font-display text-base font-bold uppercase tracking-wide text-chrome-300">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-chrome-400">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOWCASE ─────────────────────────────────────────────────── */}
      <section id="showcase" className="border-b border-white/10 bg-asphalt-950 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="Livery Gallery"
            title="Every discipline. Every brand combo."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SHOWCASE.map((item) => (
              <div
                key={item.brands.join("+")}
                className="group rounded-md border border-white/10 bg-asphalt-800 p-6 shadow-panel transition hover:border-flame-500/40"
              >
                <GarmentMockup garment={item.garment} garmentColor={item.garmentColor}>
                  <LiveryImg
                    primary={item.primary}
                    secondary={item.secondary}
                    brands={item.brands}
                    tag={item.discipline}
                    style={item.style}
                  />
                </GarmentMockup>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="font-display text-sm font-bold uppercase tracking-wide text-chrome-300">
                    {item.brands.join(" × ")}
                  </span>
                  <span className="font-display text-[11px] uppercase tracking-widest text-flame-400/80">
                    {item.discipline}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/design"
              className="rounded-sm bg-flame-500 px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-asphalt-950 shadow-glow transition hover:bg-flame-400"
            >
              Build Yours →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" className="border-b border-white/10 bg-asphalt-900 py-20">
        <div className="mx-auto max-w-4xl px-5">
          <SectionHeading eyebrow="FAQ" title="Good to know before your first order" />
          <div className="mt-10 divide-y divide-white/10 border-t border-white/10">
            {[
              [
                "Do you print my RC brand's actual logo?",
                "No. Brand names are set in our own bold display typography — never traced or copied from a manufacturer's trademarked logo artwork. It's a name-and-color livery, not licensed merch, and it isn't affiliated with or endorsed by the brands you pick.",
              ],
              [
                "Why does adding more brands cost extra?",
                `The first brand is included in the base price. Each additional one (up to ${MAX_BRANDS} total) is +${formatUsd(
                  EXTRA_BRAND_PRICE_CENTS
                )} — more names means a busier layout and more setup on our end.`,
              ],
              [
                "What's the difference between the two tee blanks?",
                "Gildan Heavy Cotton (5000) is a classic mid-weight everyday tee. Comfort Colors 1717 is a heavier, garment-dyed blank with a softer, worn-in feel — it costs more because the blank itself does.",
              ],
              [
                "How long does production and shipping take?",
                "Orders route straight to Printify's print-on-demand network. Typical production is 2–5 business days plus standard shipping — exact timing depends on the print provider your shop is connected to.",
              ],
            ].map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-display text-base font-semibold uppercase tracking-wide text-chrome-300">
                  {q}
                  <span className="ml-4 text-flame-500 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-chrome-400">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-asphalt-950 py-20">
        <div className="stripes absolute inset-0 opacity-60" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 text-center">
          <FlameMark className="h-10 w-10 text-flame-500" />
          <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight text-chrome-300 sm:text-4xl">
            Ready to build your livery?
          </h2>
          <p className="mt-3 max-w-md text-chrome-400">
            Pick your brands, dial in your colors, see it on the shirt.
          </p>
          <Link
            href="/design"
            className="mt-8 rounded-sm bg-flame-500 px-8 py-4 font-display text-sm font-bold uppercase tracking-wider text-asphalt-950 shadow-glow transition hover:bg-flame-400"
          >
            Start Your Design →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-flame-500">
        {eyebrow}
      </span>
      <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-chrome-300 sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function LiveryImg({
  primary,
  secondary,
  brands,
  tag,
  style,
}: {
  primary: string;
  secondary: string;
  brands: string[];
  tag: string;
  style: LiveryStyle;
}) {
  const src = liverySvgDataUri({ primary, secondary, brands, tag, style, size: 400 });
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={`${brands.join(", ")} livery preview`} className="h-full w-full object-cover" />;
}
