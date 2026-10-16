/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Sends the origin to other sites so adbyrd.com shows up as the referrer in their analytics
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // TODO before launch: add a Content-Security-Policy (start in Report-Only) that allows
  // googletagmanager.com, google-analytics.com, connect.facebook.net, snap.licdn.com,
  // analytics.tiktok.com, clarity.ms, bat.bing.com, va.vercel-scripts.com for the tags you enable.
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
