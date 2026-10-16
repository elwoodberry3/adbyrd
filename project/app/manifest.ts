import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Adbyrd — Intelligence, Engineered.",
    short_name: "Adbyrd",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f4ef",
    theme_color: "#1c2433",
    icons: [{ src: "/brand/adbyrd-icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
