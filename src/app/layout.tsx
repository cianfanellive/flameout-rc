import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";

const display = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
  title: "FLAMEOUT RC — Custom RC Racing Apparel",
  description:
    "Tell us your rig, your colors, your discipline. FLAMEOUT throws an AI-generated livery on a tee or cap and ships it print-on-demand. No minimums, no mass production — one-off gear for the RC obsessed.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="grain font-sans antialiased">{children}</body>
    </html>
  );
}
