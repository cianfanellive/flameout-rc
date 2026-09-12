import Link from "next/link";
import { FlameMark } from "./icons";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-asphalt-950">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <FlameMark className="h-5 w-5 text-flame-500" />
              <span className="font-display text-lg font-bold uppercase tracking-wide text-chrome-300">
                Flameout<span className="text-flame-500">RC</span>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-chrome-400">
              Custom apparel for the RC-obsessed. Every design is generated for
              your rig, your colors, your run — printed one at a time, never
              mass produced.
            </p>
          </div>

          <div>
            <p className="font-display text-xs font-bold uppercase tracking-widest text-chrome-400">
              Shop
            </p>
            <ul className="mt-3 space-y-2 text-sm text-chrome-400">
              <li>
                <Link href="/design" className="transition hover:text-flame-400">
                  Design a Tee
                </Link>
              </li>
              <li>
                <Link href="/design" className="transition hover:text-flame-400">
                  Design a Cap
                </Link>
              </li>
              <li>
                <Link href="/#showcase" className="transition hover:text-flame-400">
                  Livery Gallery
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-xs font-bold uppercase tracking-widest text-chrome-400">
              Info
            </p>
            <ul className="mt-3 space-y-2 text-sm text-chrome-400">
              <li>
                <Link href="/#how-it-works" className="transition hover:text-flame-400">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="transition hover:text-flame-400">
                  Shipping &amp; Printing
                </Link>
              </li>
              <li>
                <a
                  href="https://printify.com"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-flame-400"
                >
                  Fulfilled via Printify
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-chrome-400/70 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} FlameoutRC. Not affiliated with any RC manufacturer.</p>
          <p>
            Designs are AI-generated original artwork inspired by your rig — not
            reproductions of third-party logos or team liveries.
          </p>
        </div>
      </div>
    </footer>
  );
}
