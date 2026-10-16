"use client";

import { openConsentManager } from "./consent";

export default function CookieSettingsButton({ className = "", label = "Cookie Settings" }: { className?: string; label?: string }) {
  return (
    <button type="button" onClick={openConsentManager} className={className}>
      {label}
    </button>
  );
}
