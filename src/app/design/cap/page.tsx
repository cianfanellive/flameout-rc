import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { DesignerClient } from "../DesignerClient";

export const metadata = {
  title: "BUILD YOUR CAP: FLAMEOUTRC",
};

export default function DesignCapPage() {
  return (
    <>
      <Nav />
      <main className="asphalt-texture bg-asphalt-950 py-12">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-8 max-w-xl">
            <span className="font-display text-xs uppercase tracking-[0.2em] text-flame-500">
              BUILD YOUR CAP
            </span>
            <h1 className="mt-2 font-display text-4xl uppercase tracking-tight text-chrome-300">
              YOUR SPONSORS. YOUR COLORS. YOUR CAP.
            </h1>
            <p className="mt-2 text-sm text-chrome-400">
              Pick brands or upload your own logos, dial in colors and a font. Snapback caps are
              one size fits most.
            </p>
          </div>
          <DesignerClient garment="cap" />
        </div>
      </main>
      <Footer />
    </>
  );
}
