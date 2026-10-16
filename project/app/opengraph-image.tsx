import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Adbyrd — Custom apps and AI receptionists for small business. Fixed price, built in weeks. Kalamazoo, Michigan.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const svg = await readFile(join(process.cwd(), "public/brand/adbyrd-icon.svg"));
  const logo = `data:image/svg+xml;base64,${svg.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 80% 20%, #3a4a5c 0%, #1c2433 55%, #121726 100%)",
          color: "#f6f4ef",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={84} height={84} alt="" />
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>Adbyrd</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "#a8bfc0", letterSpacing: 4, textTransform: "uppercase" }}>
            Custom Apps &amp; AI for Small Business
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, marginTop: 18, letterSpacing: -2 }}>
            Custom Apps &amp; AI for Your Business.
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, color: "#dad4be", letterSpacing: -2 }}>Fixed Price. Built in Weeks.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#c9ced4" }}>
          <span>Intelligence, Engineered.</span>
          <span>Kalamazoo · Western Michigan · adbyrd.com</span>
        </div>
      </div>
    ),
    size,
  );
}
