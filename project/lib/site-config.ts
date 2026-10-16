/**
 * Central configuration for contact details, social profiles, tracking IDs and
 * verification tokens. Every tracking/verification value is read from an
 * environment variable (see .env.example) — nothing loads until an ID is set.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://adbyrd.com").replace(/\/$/, "");

export const contact = {
  street: "251 N Rose St",
  city: "Kalamazoo",
  region: "MI",
  postalCode: "49007",
  country: "US",
  phoneDisplay: "+1 (888) 712-1694",
  phoneE164: "+18887121694",
  email: "support@adbyrd.com",
  // Approximate downtown Kalamazoo coordinates — replace with the exact pin from Google Business Profile.
  geo: { lat: 42.2931, lng: -85.5837 },
};

export const addressOneLine = `${contact.street}, ${contact.city}, ${contact.region} ${contact.postalCode}`;

/** Google Business Profile (GBP). Set these once the profile is verified. */
export const gbp = {
  // Public profile / Maps URL, e.g. https://maps.app.goo.gl/xxxx or https://www.google.com/maps?cid=XXXXXXXX
  profileUrl: process.env.NEXT_PUBLIC_GBP_PROFILE_URL || "",
  // "Write a review" short link from GBP → Ask for reviews
  reviewUrl: process.env.NEXT_PUBLIC_GBP_REVIEW_URL || "",
  // Fallback directions link (works without a GBP listing)
  directionsUrl:
    process.env.NEXT_PUBLIC_GBP_PROFILE_URL ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Adbyrd ${addressOneLine}`)}`,
};

export type SocialPlatform = "instagram" | "facebook" | "linkedin" | "youtube" | "tiktok";

export const socials: { platform: SocialPlatform; label: string; url: string }[] = [
  { platform: "instagram", label: "Instagram", url: "https://www.instagram.com/adbyrdmarketing/" },
  { platform: "facebook", label: "Facebook", url: "https://www.facebook.com/people/AdByrd-Advertising-Agency/100088307161043/" },
  { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/adbyrd/" },
  { platform: "youtube", label: "YouTube", url: "https://www.youtube.com/@adbyrd" },
  { platform: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@adbyrdmarketing" },
];

/**
 * Appends UTM parameters to an outbound URL so traffic can be attributed when
 * it lands on a destination you also measure (and so outbound clicks are
 * self-describing in exports). Existing query strings are preserved.
 */
export function withUtm(
  url: string,
  params: { source?: string; medium?: string; campaign: string; content?: string; term?: string },
) {
  const u = new URL(url);
  u.searchParams.set("utm_source", params.source ?? "adbyrd.com");
  u.searchParams.set("utm_medium", params.medium ?? "website");
  u.searchParams.set("utm_campaign", params.campaign);
  if (params.content) u.searchParams.set("utm_content", params.content);
  if (params.term) u.searchParams.set("utm_term", params.term);
  return u.toString();
}

export const tracking = {
  /** Google Tag Manager container (recommended: manage GA4, Ads and pixels here). */
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
  /** GA4 measurement ID — only loaded directly when GTM is NOT set (avoids double counting). */
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID || "",
  /** Google Ads conversion ID (AW-XXXXXXXXX) + optional lead conversion label. */
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "",
  googleAdsLeadLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  linkedinPartnerId: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || "",
  linkedinLeadConversionId: process.env.NEXT_PUBLIC_LINKEDIN_LEAD_CONVERSION_ID || "",
  tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "",
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID || "",
  bingUetId: process.env.NEXT_PUBLIC_BING_UET_ID || "",
  /** Vercel Web Analytics + Speed Insights are cookieless and on by default when deployed to Vercel. */
  vercelAnalytics: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS !== "false",
};

export const verification = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION || "",
  pinterest: process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION || "",
};
