import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/sora";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnalyticsSuite from "@/components/analytics";
import { ConsentDefaults } from "@/components/analytics/GoogleTags";
import StructuredData from "@/components/StructuredData";
import { site } from "@/lib/content";
import { SITE_URL, verification } from "@/lib/site-config";

const otherVerification: Record<string, string> = {};
if (verification.bing) otherVerification["msvalidate.01"] = verification.bing;
if (verification.facebook) otherVerification["facebook-domain-verification"] = verification.facebook;
if (verification.pinterest) otherVerification["p:domain_verify"] = verification.pinterest;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Adbyrd — Custom Apps & AI Receptionists for Small Business | Kalamazoo, MI",
    template: "%s · Adbyrd",
  },
  description: site.description,
  applicationName: "Adbyrd",
  authors: [{ name: "Adbyrd", url: SITE_URL }],
  keywords: [
    "small business app development",
    "custom app developer Kalamazoo",
    "AI receptionist for small business",
    "online booking app",
    "iPhone app development Michigan",
    "workflow automation",
    "Western Michigan software company",
    "Grand Rapids app developer",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Adbyrd — Custom Apps & AI for Small Business",
    description: site.description,
    siteName: "Adbyrd",
    url: SITE_URL,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adbyrd — Custom Apps & AI for Small Business",
    description: site.description,
    // site: "@adbyrd", // add X/Twitter handle if one exists
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  verification: {
    google: verification.google || undefined,
    other: Object.keys(otherVerification).length ? otherVerification : undefined,
  },
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#1c2433",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ConsentDefaults />
        <StructuredData />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-pill focus:bg-ember focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <AnalyticsSuite />
      </body>
    </html>
  );
}
