import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import { googleFontsHref } from "@/lib/fonts";
import "./globals.css";

const display = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FLAMEOUT RC: CUSTOM RC RACING APPAREL",
  description:
    "Pick up to 5 RC brands or upload your own logos, your colors, and a livery style. See it live, then see it on the shirt or cap, printed one-off via Printify. No minimums, no mass production.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        {/* The 20 sponsor/name-tag fonts (lib/fonts.ts), loaded once so the
            live SVG preview renders them inline without an extra request
            per style change. */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={googleFontsHref()} />
      </head>
      <body className="grain font-sans antialiased">{children}</body>
    </html>
  );
}
