import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Brand guideline: primary font family is Inter across all digital platforms.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Adbyrd — Your Agency Team, Always On",
  description: "Adbyrd builds and operates AI-native marketing departments powered by specialist agents, persistent client memory, and human-governed execution. Book a free 15-minute call.",
  openGraph: {
    title: "Adbyrd — Your Agency Team, Always On",
    description:
      "A full-stack marketing department powered by specialist AI agents that know your business, remember every decision, and execute around the clock.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
