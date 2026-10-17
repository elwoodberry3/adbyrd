import { engagements, serviceAreas, services, site } from "@/lib/content";
import { SITE_URL, contact, gbp, socials } from "@/lib/site-config";

/**
 * JSON-LD for search engines and AI answer engines:
 * Organization + ProfessionalService (LocalBusiness) + WebSite.
 * Keep NAP (name, address, phone) identical to the Google Business Profile.
 */
export default function StructuredData() {
  const sameAs = [...socials.map((s) => s.url), gbp.profileUrl].filter(Boolean);
  const address = {
    "@type": "PostalAddress",
    streetAddress: contact.street,
    addressLocality: contact.city,
    addressRegion: contact.region,
    postalCode: contact.postalCode,
    addressCountry: contact.country,
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Adbyrd",
        url: SITE_URL,
        logo: `${SITE_URL}/brand/adbyrd-icon.svg`,
        slogan: site.tagline,
        description: site.description,
        email: contact.email,
        telephone: contact.phoneE164,
        address,
        sameAs,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: contact.phoneE164,
            email: contact.email,
            areaServed: "US",
            availableLanguage: ["en"],
          },
        ],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#localbusiness`,
        name: "Adbyrd",
        parentOrganization: { "@id": `${SITE_URL}/#organization` },
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image`,
        telephone: contact.phoneE164,
        email: contact.email,
        address,
        geo: { "@type": "GeoCoordinates", latitude: contact.geo.lat, longitude: contact.geo.lng },
        hasMap: gbp.directionsUrl,
        areaServed: [
          ...serviceAreas.map((name) => ({
            "@type": "City",
            name,
            containedInPlace: { "@type": "State", name: "Michigan" },
          })),
          { "@type": "Country", name: "United States" },
        ],
        priceRange: "$$",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Small business packages",
          itemListElement: engagements
            .filter((e) => e.price.includes("$"))
            .map((e) => ({
              "@type": "Offer",
              name: e.name,
              description: e.deliverable,
              priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "USD",
                minPrice: Number(e.price.replace(/[^0-9–-]/g, "").split(/[–-]/)[0]),
              },
            })),
        },
        // openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "09:00", closes: "17:00" }],
        knowsAbout: [
          ...services.map((s) => s.eyebrow),
          "Small business app development",
          "AI voice agents",
          "Online booking and payment systems",
          "Local SEO and generative engine optimization",
        ],
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Adbyrd",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-US",
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />;
}
