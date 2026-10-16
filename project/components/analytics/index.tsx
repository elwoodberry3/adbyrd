import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { tracking } from "@/lib/site-config";
import ConsentBanner from "./ConsentBanner";
import { GoogleTags } from "./GoogleTags";
import MarketingTags from "./MarketingTags";
import Tracker from "./Tracker";

/** Everything measurement-related, rendered once at the end of <body>. */
export default function AnalyticsSuite() {
  return (
    <>
      <GoogleTags />
      <MarketingTags />
      <Tracker />
      <ConsentBanner />
      {tracking.vercelAnalytics && (
        <>
          <VercelAnalytics />
          <SpeedInsights />
        </>
      )}
    </>
  );
}
