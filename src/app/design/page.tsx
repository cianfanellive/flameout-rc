import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { DesignerClient } from "./DesignerClient";

export const metadata = {
  title: "Build Your Design — FlameoutRC",
};

export default function DesignPage() {
  return (
    <>
      <Nav />
      <main className="asphalt-texture bg-asphalt-950 py-12">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-8 max-w-xl">
            <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-flame-500">
              Build Your Design
            </span>
            <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-chrome-300">
              Your rig. Your colors. Your gear.
            </h1>
            <p className="mt-2 text-sm text-chrome-400">
              Fill this out, hit generate, and regenerate as many times as you
              want — nothing gets printed until you say go.
            </p>
          </div>
          <DesignerClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
