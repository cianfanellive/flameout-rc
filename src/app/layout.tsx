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
    "Pick up to 5 RC brands, your colors, and a livery style. See it live, then see it on the shirt or cap — printed one-off via Printify. No minimums, no mass production.",
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
