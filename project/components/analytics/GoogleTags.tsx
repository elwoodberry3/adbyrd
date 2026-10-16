import Script from "next/script";
import { tracking } from "@/lib/site-config";

/**
 * Google Consent Mode v2 defaults + Google Tag Manager OR direct GA4/Google Ads.
 * - Consent defaults are set before any Google tag loads (rendered in <head>).
 * - If NEXT_PUBLIC_GTM_ID is set, GTM is the single source of truth (configure GA4, Ads, conversion linker there).
 * - Otherwise GA4 and/or Google Ads load directly via gtag.js.
 */
export function ConsentDefaults() {
  const mode = process.env.NEXT_PUBLIC_CONSENT_MODE === "opt-out" ? "opt-out" : "opt-in";
  const def = mode === "opt-out" ? "granted" : "denied";
  const js = `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
var gpc=navigator.globalPrivacyControl===true;
gtag('consent','default',{analytics_storage:'${def}',ad_storage:gpc?'denied':'${def}',ad_user_data:gpc?'denied':'${def}',ad_personalization:gpc?'denied':'${def}',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('set','url_passthrough',true);gtag('set','ads_data_redaction',true);
try{var c=JSON.parse(localStorage.getItem('adbyrd_consent')||'null');if(c){var m=c.marketing&&!gpc;gtag('consent','update',{analytics_storage:c.analytics?'granted':'denied',ad_storage:m?'granted':'denied',ad_user_data:m?'granted':'denied',ad_personalization:m?'granted':'denied'});}}catch(e){}
`.trim();
  return <script id="consent-defaults" dangerouslySetInnerHTML={{ __html: js }} />;
}

export function GoogleTags() {
  const { gtmId, ga4Id, googleAdsId } = tracking;

  if (gtmId) {
    return (
      <>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
      </>
    );
  }

  const primary = ga4Id || googleAdsId;
  if (!primary) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${primary}`} strategy="afterInteractive" />
      <Script id="gtag-config" strategy="afterInteractive">
        {`gtag('js',new Date());${ga4Id ? `gtag('config','${ga4Id}');` : ""}${googleAdsId ? `gtag('config','${googleAdsId}');` : ""}`}
      </Script>
    </>
  );
}
