import Link from "next/link";
import { FlameMark } from "./icons";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-asphalt-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2 group">
          <FlameMark className="h-6 w-6 text-flame-500 transition group-hover:scale-110" />
          <span className="font-display text-xl uppercase tracking-wide text-chrome-300">
            Flameout<span className="text-flame-500">RC</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 font-display text-sm font-medium uppercase tracking-wider text-chrome-400 md:flex">
          <Link href="/#how-it-works" className="transition hover:text-flame-400">
            HOW IT WORKS
          </Link>
          <Link href="/#showcase" className="transition hover:text-flame-400">
            DESIGNS
          </Link>
          <Link href="/#faq" className="transition hover:text-flame-400">
            FAQ
          </Link>
        </nav>

        <Link
          href="/design"
          className="rounded-sm bg-flame-500 px-4 py-2 font-display text-sm uppercase tracking-wide text-asphalt-950 shadow-glow transition hover:bg-flame-400"
        >
          START YOUR DESIGN
        </Link>
      </div>
    </header>
  );
}
