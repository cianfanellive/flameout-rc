import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { DesignerClient } from "./DesignerClient";

export const metadata = {
  title: "BUILD YOUR DESIGN: FLAMEOUTRC",
};

export default function DesignPage() {
  return (
    <>
      <Nav />
      <main className="asphalt-texture bg-asphalt-950 py-12">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-8 max-w-xl">
            <span className="font-display text-xs uppercase tracking-[0.2em] text-flame-500">
              BUILD YOUR DESIGN
            </span>
            <h1 className="mt-2 font-display text-4xl uppercase tracking-tight text-chrome-300">
              YOUR SPONSORS. YOUR COLORS. YOUR GEAR.
            </h1>
            <p className="mt-2 text-sm text-chrome-400">
              Pick brands or upload your own logos, dial in colors, a font, and a name tag. See
              it live on the shirt. Nothing gets printed until you say go.
            </p>
          </div>
          <DesignerClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
