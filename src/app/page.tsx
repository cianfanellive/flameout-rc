import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { GarmentMockup } from "@/components/GarmentMockup";
import { liverySvgDataUri, type LiveryStyle } from "@/lib/livery";
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
    title: "Tell us your rig",
    body: "Brand, model, discipline — buggy, truck, drift, crawler, drone, nitro — plus your primary and secondary colors.",
  },
  {
    icon: BoltIcon,
    title: "AI throws a livery",
    body: "We turn your rig and colors into an original, print-ready graphic in seconds. Not a logo swap — a real design.",
  },
  {
    icon: ShirtIcon,
    title: "Preview & lock it in",
    body: "See it live on a tee or snapback mockup. Regenerate as many times as you want before you commit.",
  },
  {
    icon: TruckIcon,
    title: "We print & ship",
    body: "Printify handles production and shipping on demand — no warehouse, no minimums, no waiting on a batch run.",
  },
];

const FEATURES = [
  {
    title: "One-off by design",
    body: "Every graphic is generated fresh from your inputs. Nobody else at the track is wearing your shirt.",
  },
  {
    title: "Print-on-demand",
    body: "Nothing gets made until you order it. No dead stock, no clearance bin, no waste.",
  },
  {
    title: "Built for two garments",
    body: "Tees and structured snapback caps — the two things every pit box actually needs.",
  },
  {
    title: "No trademark headaches",
    body: "AI is prompted to build original livery art inspired by your rig, not to reproduce a manufacturer's logo.",
  },
];

const SHOWCASE: Array<{
  garment: "tee" | "cap";
  discipline: string;
  text: string;
  primary: string;
  secondary: string;
  style: LiveryStyle;
  garmentColor: "black" | "charcoal" | "white";
}> = [
  { garment: "tee", discipline: "1:10 BUGGY", text: "APEX 10", primary: "#ff5a1f", secondary: "#ffc400", style: "flame", garmentColor: "black" },
  { garment: "cap", discipline: "SHORT COURSE TRUCK", text: "RIDGE 4X4", primary: "#ff2d2d", secondary: "#0a0c0f", style: "checkered", garmentColor: "black" },
  { garment: "tee", discipline: "RC DRIFT", text: "NIGHT DRIFT", primary: "#7dd3fc", secondary: "#ff2d2d", style: "neon", garmentColor: "charcoal" },
  { garment: "cap", discipline: "ROCK CRAWLER", text: "GRIT CRAWL", primary: "#c9ccd1", secondary: "#5b6470", style: "carbon", garmentColor: "black" },
  { garment: "tee", discipline: "FPV DRONE", text: "REDOUT FPV", primary: "#ffd23f", secondary: "#ff5a1f", style: "retro", garmentColor: "charcoal" },
  { garment: "cap", discipline: "NITRO ON-ROAD", text: "8500 RPM", primary: "#ff8a3d", secondary: "#ffc400", style: "flame", garmentColor: "charcoal" },
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
              AI-designed · Print-on-demand
            </span>
            <h1 className="font-display text-5xl font-bold uppercase leading-[0.98] tracking-tight text-chrome-300 sm:text-6xl md:text-7xl">
              Design your
              <br />
              <span className="text-flame-500">ride.</span> Wear your
              <br />
              <span className="text-stroke">rig.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-chrome-400">
              Give us your rig, your colors, your discipline. FlameoutRC
              generates an original livery graphic and prints it one-off on a
              tee or snapback — no minimums, no mass production.
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
                ["~60s", "design time"],
                ["1-of-1", "every print"],
                ["2", "garments: tee + cap"],
                ["0", "warehouse inventory"],
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
                  text="APEX 10"
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
                  text="RIDGE"
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
            title="Every discipline. Every color combo."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SHOWCASE.map((item) => (
              <div
                key={item.text}
                className="group rounded-md border border-white/10 bg-asphalt-800 p-6 shadow-panel transition hover:border-flame-500/40"
              >
                <GarmentMockup garment={item.garment} garmentColor={item.garmentColor}>
                  <LiveryImg
                    primary={item.primary}
                    secondary={item.secondary}
                    text={item.text}
                    tag={item.discipline}
                    style={item.style}
                  />
                </GarmentMockup>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-sm font-bold uppercase tracking-wide text-chrome-300">
                    {item.text}
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
                "No. The AI is prompted to design original livery-style artwork inspired by your rig's name, colors, and discipline — not to trace or reproduce a manufacturer's trademarked logo. That keeps every design safe to sell.",
              ],
              [
                "How long does production and shipping take?",
                "Orders route straight to Printify's print-on-demand network. Typical production is 2–5 business days plus standard shipping — exact timing depends on the print provider your shop is connected to.",
              ],
              [
                "Can I regenerate the design if I don't love it?",
                "Yes — regenerate as many times as you want before ordering. Nothing gets sent to production until you approve a design.",
              ],
              [
                "What garments do you offer?",
                "Two, on purpose: a classic tee and a structured snapback cap. Fewer SKUs, better quality control, faster turnaround.",
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
            Sixty seconds and a color picker between you and pit-lane-worthy gear.
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
  text,
  tag,
  style,
}: {
  primary: string;
  secondary: string;
  text: string;
  tag: string;
  style: LiveryStyle;
}) {
  const src = liverySvgDataUri({ primary, secondary, text, tag, style, size: 400 });
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={`${text} livery preview`} className="h-full w-full object-cover" />;
}
