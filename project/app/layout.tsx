import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/sora";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: {
    default: "Adbyrd — Agentic AI & Custom Software Development",
    template: "%s · Adbyrd",
  },
  description: site.description,
  openGraph: {
    title: "Adbyrd — Intelligence, Engineered.",
    description: site.description,
    siteName: "Adbyrd",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d3328",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
