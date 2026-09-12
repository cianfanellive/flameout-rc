import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { GarmentMockup, type ShirtColorId } from "@/components/GarmentMockup";
import { buildLiverySVG, type GraphicId, type SponsorItem } from "@/lib/livery";
import { EXTRA_SPONSOR_PRICE_CENTS, formatUsd, INCLUDED_SPONSORS, MAX_SPONSORS, TEE_BLANK_LABEL } from "@/lib/pricing";
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
    title: "PICK YOUR SPONSORS",
    body: `Choose real RC brands from the dropdown or upload your own logo. First ${INCLUDED_SPONSORS} are included, +${formatUsd(
      EXTRA_SPONSOR_PRICE_CENTS
    )} each after that, up to ${MAX_SPONSORS} total.`,
  },
  {
    icon: BoltIcon,
    title: "DIAL IN THE LOOK",
    body: "Three colors, a font, and one of 5 graphic templates. The design updates live as you go, no waiting, no generating.",
  },
  {
    icon: ShirtIcon,
    title: "SEE IT ON THE SHIRT",
    body: "The full tee or cap mockup updates instantly, in your shirt color, with the exact price shown before you commit.",
  },
  {
    icon: TruckIcon,
    title: "WE PRINT AND SHIP",
    body: "Printify handles production and shipping on demand. No warehouse, no minimums, no waiting on a batch run.",
  },
];

const FEATURES = [
  {
    title: "YOUR LOGO OR OURS",
    body: "Pick a brand from the list or upload your own sponsor logo. Mix both in the same sponsor board.",
  },
  {
    title: "20 FONTS, 3 NAME TAG STYLES",
    body: "Bar, outline, or badge for your driver name and car number, set in a real font, not a generic default.",
  },
  {
    title: "COMFORT COLORS, 5 COLORWAYS",
    body: `Every tee is ${TEE_BLANK_LABEL}, a heavier, garment-dyed blank, in your pick of 5 shirt colors.`,
  },
  {
    title: "TYPOGRAPHY, NOT BOOTLEG LOGOS",
    body: "Brand names are set in our own display type, never traced manufacturer artwork. See the footer for the full note.",
  },
];

const SHOWCASE: Array<{
  garment: "tee" | "cap";
  label: string;
  sponsors: SponsorItem[];
  primary: string;
  secondary: string;
  tertiary: string;
  graphic: GraphicId;
  garmentColor: ShirtColorId;
}> = [
  { garment: "tee", label: "TRAXXAS", sponsors: [{ kind: "text", label: "Traxxas" }], primary: "#ff5a1f", secondary: "#ffc400", tertiary: "#0a0c0f", graphic: "star", garmentColor: "black" },
  { garment: "cap", label: "TEAM ASSOCIATED x LOSI", sponsors: [{ kind: "text", label: "Team Associated" }, { kind: "text", label: "Losi" }], primary: "#ff2d2d", secondary: "#0a0c0f", tertiary: "#f4f5f6", graphic: "grid", garmentColor: "black" },
  { garment: "tee", label: "ARRMA", sponsors: [{ kind: "text", label: "ARRMA" }], primary: "#7dd3fc", secondary: "#ff2d2d", tertiary: "#0a0c0f", graphic: "bolt", garmentColor: "navy" },
  { garment: "cap", label: "AXIAL", sponsors: [{ kind: "text", label: "Axial" }], primary: "#c9ccd1", secondary: "#5b6470", tertiary: "#0a0c0f", graphic: "shield", garmentColor: "grey" },
  { garment: "tee", label: "REDCAT x PRO-LINE x JCONCEPTS", sponsors: [{ kind: "text", label: "Redcat Racing" }, { kind: "text", label: "Pro-Line" }, { kind: "text", label: "JConcepts" }], primary: "#ffd23f", secondary: "#ff5a1f", tertiary: "#0a0c0f", graphic: "spear", garmentColor: "red" },
  { garment: "cap", label: "KYOSHO", sponsors: [{ kind: "text", label: "Kyosho" }], primary: "#ff8a3d", secondary: "#ffc400", tertiary: "#0a0c0f", graphic: "star", garmentColor: "white" },
];

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10 bg-asphalt-900">
        <div className="stripes absolute inset-0" />
        <div className="asphalt-texture absolute inset-0" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kyosho-buggy.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-1/2 hidden w-[52%] max-w-2xl -translate-y-1/2 rotate-[-4deg] opacity-[0.14] mix-blend-luminosity lg:block"
        />
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-flame-500 to-transparent" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-sm border border-flame-500/40 bg-flame-500/10 px-3 py-1 font-display text-xs uppercase tracking-widest text-flame-400">
              <CheckeredFlagIcon className="h-4 w-4" />
              PICK OR UPLOAD YOUR SPONSORS. PRINT-ON-DEMAND.
            </span>
            <h1 className="font-display text-5xl uppercase leading-[0.98] tracking-tight text-chrome-300 sm:text-6xl md:text-7xl">
              Design your
              <br />
              <span className="text-flame-500">ride.</span> Wear your
              <br />
              <span className="text-stroke">rig.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-chrome-400">
              Pick up to {MAX_SPONSORS} RC brands or upload your own logos, three colors, a
              font, and a graphic template. See it update live, then see it on the shirt,
              printed one-off on a tee or snapback. No minimums.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/design"
                className="rounded-sm bg-flame-500 px-6 py-3.5 font-display uppercase tracking-wider text-asphalt-950 shadow-glow transition hover:bg-flame-400"
              >
                START YOUR DESIGN →
              </Link>
              <Link
                href="#how-it-works"
                className="rounded-sm border border-white/15 px-6 py-3.5 font-display uppercase tracking-wider text-chrome-300 transition hover:border-flame-500/50 hover:text-flame-400"
              >
                HOW IT WORKS
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
              {[
                ["LIVE", "INSTANT PREVIEW"],
                [`${MAX_SPONSORS}`, "SPONSORS, MAX"],
                ["5", "SHIRT COLORS"],
                [`+${formatUsd(EXTRA_SPONSOR_PRICE_CENTS)}`, "PER EXTRA SPONSOR"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl text-flame-400">{value}</dt>
                  <dd className="text-xs uppercase tracking-wide text-chrome-400/80">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto flex w-full max-w-sm items-center justify-center">
            <div className="w-[68%] rotate-[3deg] drop-shadow-2xl">
              <GarmentMockup garment="tee" garmentColor="black">
                <LiverySvg
                  primary="#ff5a1f"
                  secondary="#ffc400"
                  tertiary="#0a0c0f"
                  sponsors={[{ kind: "text", label: "Traxxas" }]}
                  graphic="star"
                />
              </GarmentMockup>
            </div>
            <div className="absolute -bottom-4 -left-2 w-[42%] -rotate-[6deg] drop-shadow-2xl">
              <GarmentMockup garment="cap" garmentColor="grey">
                <LiverySvg
                  primary="#ff2d2d"
                  secondary="#0a0c0f"
                  tertiary="#f4f5f6"
                  sponsors={[{ kind: "text", label: "Team Associated" }, { kind: "text", label: "Losi" }]}
                  graphic="grid"
                />
              </GarmentMockup>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="border-b border-white/10 bg-asphalt-950 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading eyebrow="THE FLOW" title="FROM PIT BOX TO PRINT IN FOUR STEPS" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="asphalt-texture group relative rounded-md border border-white/10 bg-asphalt-800 p-6 shadow-panel transition hover:border-flame-500/40"
              >
                <span className="font-display text-5xl text-white/5">0{i + 1}</span>
                <step.icon className="mt-2 h-7 w-7 text-flame-500" />
                <h3 className="mt-3 font-display text-lg uppercase tracking-wide text-chrome-300">
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
          <SectionHeading eyebrow="BUILT DIFFERENT" title="THE BEST CREATION TOOL IN RC APPAREL" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4 rounded-md border border-white/10 bg-asphalt-950/60 p-5">
                <FlameMark className="mt-1 h-5 w-5 flex-shrink-0 text-flame-500" />
                <div>
                  <h3 className="font-display text-base uppercase tracking-wide text-chrome-300">{f.title}</h3>
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
          <SectionHeading eyebrow="LIVERY GALLERY" title="EVERY SPONSOR COMBO. EVERY GRAPHIC." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SHOWCASE.map((item) => (
              <div
                key={item.label}
                className="group rounded-md border border-white/10 bg-asphalt-800 p-6 shadow-panel transition hover:border-flame-500/40"
              >
                <GarmentMockup garment={item.garment} garmentColor={item.garmentColor}>
                  <LiverySvg
                    primary={item.primary}
                    secondary={item.secondary}
                    tertiary={item.tertiary}
                    sponsors={item.sponsors}
                    graphic={item.graphic}
                  />
                </GarmentMockup>
                <div className="mt-4">
                  <span className="font-display text-sm uppercase tracking-wide text-chrome-300">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/design"
              className="rounded-sm bg-flame-500 px-6 py-3.5 font-display uppercase tracking-wider text-asphalt-950 shadow-glow transition hover:bg-flame-400"
            >
              BUILD YOURS →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" className="border-b border-white/10 bg-asphalt-900 py-20">
        <div className="mx-auto max-w-4xl px-5">
          <SectionHeading eyebrow="FAQ" title="GOOD TO KNOW BEFORE YOUR FIRST ORDER" />
          <div className="mt-10 divide-y divide-white/10 border-t border-white/10">
            {[
              [
                "DO YOU PRINT MY RC BRAND'S ACTUAL LOGO?",
                "No. Brand names are set in our own bold display typography, never traced or copied from a manufacturer's trademarked logo artwork. It's a name-and-color livery, not licensed merch, and it isn't affiliated with or endorsed by the brands you pick.",
              ],
              [
                "CAN I UPLOAD MY OWN SPONSOR LOGO?",
                `Yes. The sponsor picker lets you add real RC brands from the dropdown, upload your own logo image, or mix both, up to ${MAX_SPONSORS} total. Uploaded logos get a colored frame that picks up your chosen palette.`,
              ],
              [
                "WHY DOES ADDING MORE THAN 5 SPONSORS COST EXTRA?",
                `The first ${INCLUDED_SPONSORS} sponsors are included in the base price. Each one after that, up to ${MAX_SPONSORS} total, is +${formatUsd(
                  EXTRA_SPONSOR_PRICE_CENTS
                )}. More names means a busier layout and more setup on our end.`,
              ],
              [
                "WHAT TEE DO YOU USE, AND WHAT COLORS?",
                `Every tee is ${TEE_BLANK_LABEL}, a heavier, garment-dyed blank with a soft, worn-in feel, offered in 5 shirt colors: Black, White, True Navy, Crimson, and Granite.`,
              ],
              [
                "HOW LONG DOES PRODUCTION AND SHIPPING TAKE?",
                "Orders route straight to Printify's print-on-demand network. Typical production is 2 to 5 business days plus standard shipping. Exact timing depends on the print provider your shop is connected to.",
              ],
            ].map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-display text-base uppercase tracking-wide text-chrome-300">
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
          <h2 className="mt-4 font-display text-3xl uppercase tracking-tight text-chrome-300 sm:text-4xl">
            READY TO BUILD YOUR LIVERY?
          </h2>
          <p className="mt-3 max-w-md text-chrome-400">
            Pick your sponsors, dial in your colors, see it on the shirt.
          </p>
          <Link
            href="/design"
            className="mt-8 rounded-sm bg-flame-500 px-8 py-4 font-display uppercase tracking-wider text-asphalt-950 shadow-glow transition hover:bg-flame-400"
          >
            START YOUR DESIGN →
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
      <span className="font-display text-xs uppercase tracking-[0.2em] text-flame-500">{eyebrow}</span>
      <h2 className="mt-2 font-display text-3xl uppercase tracking-tight text-chrome-300 sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function LiverySvg({
  primary,
  secondary,
  tertiary,
  sponsors,
  graphic,
}: {
  primary: string;
  secondary: string;
  tertiary: string;
  sponsors: SponsorItem[];
  graphic: GraphicId;
}) {
  const svg = buildLiverySVG({ primary, secondary, tertiary, sponsors, graphic });
  return <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: svg }} />;
}
