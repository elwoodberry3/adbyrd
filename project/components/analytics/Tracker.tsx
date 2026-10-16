"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { captureAttribution } from "./attribution";
import { track } from "./track";

/**
 * Site-wide behavioral tracking (no UI):
 *  - Inbound: captures first/last-touch attribution and pushes it to the dataLayer.
 *  - Outbound: outbound_click, social_click, phone_click, email_click, directions_click.
 *  - Engagement: cta_click (any element with data-cta), scroll_depth (25/50/75/90), virtual page views for pixels.
 */
export default function Tracker() {
  const pathname = usePathname();
  const firstLoad = useRef(true);

  // Inbound attribution — once per full page load
  useEffect(() => {
    const { first, last } = captureAttribution();
    window.dataLayer = window.dataLayer || ([] as unknown as NonNullable<Window["dataLayer"]>);
    window.dataLayer.push({
      event: "attribution_ready",
      first_touch_source: first?.source,
      first_touch_medium: first?.medium,
      first_touch_campaign: first?.campaign,
      last_touch_source: last?.source,
      last_touch_medium: last?.medium,
      last_touch_campaign: last?.campaign,
      landing_page: first?.landing_page,
    });
  }, []);

  // Click delegation
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button[data-cta]");
      if (!el) return;
      const placement =
        el.closest<HTMLElement>("[data-placement]")?.dataset.placement ??
        (el.closest("footer") ? "footer" : el.closest("header") ? "header" : el.closest("main section")?.id || "body");
      const text = (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 100);

      if (el.dataset.cta) {
        track("cta_click", { cta_text: el.dataset.cta, cta_href: el.getAttribute("href") ?? undefined, page_path: window.location.pathname, placement });
      }

      if (!(el instanceof HTMLAnchorElement) || !el.href) return;
      const href = el.href;

      if (href.startsWith("tel:")) return track("phone_click", { phone_number: href.slice(4), placement, page_path: window.location.pathname });
      if (href.startsWith("mailto:")) return track("email_click", { email: href.slice(7).split("?")[0], placement, page_path: window.location.pathname });

      let url: URL;
      try {
        url = new URL(href);
      } catch {
        return;
      }
      if (url.host === window.location.host) return;

      if (el.dataset.social) {
        return track("social_click", { platform: el.dataset.social, placement: el.dataset.placement ?? placement, link_url: href, outbound: true });
      }
      if (el.dataset.directions !== undefined || /google\.[^/]+\/maps|maps\.app\.goo\.gl|maps\.apple\.com/.test(href)) {
        return track("directions_click", { link_url: href, placement });
      }
      track("outbound_click", { link_url: href, link_domain: url.hostname, link_text: text, placement, outbound: true });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // Scroll depth per page + SPA page views for non-Google pixels
  useEffect(() => {
    if (!firstLoad.current) {
      window.fbq?.("track", "PageView");
      window.ttq?.page();
    }
    firstLoad.current = false;

    const marks = [25, 50, 75, 90];
    const hit = new Set<number>();
    const onScroll = () => {
      const h = document.documentElement;
      const pct = ((h.scrollTop + window.innerHeight) / h.scrollHeight) * 100;
      for (const m of marks) {
        if (pct >= m && !hit.has(m)) {
          hit.add(m);
          track("scroll_depth", { percent_scrolled: m, page_path: pathname });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
