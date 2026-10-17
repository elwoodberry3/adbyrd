"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/content";
import { Button, Logo } from "./ui";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? "border-b border-line bg-white/85 shadow-sm shadow-black/[0.03] backdrop-blur-lg" : "bg-white"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label="Adbyrd home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 rounded-pill bg-ivory p-1.5 ring-1 ring-line">
            {nav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-pill px-4 py-2 text-sm font-medium transition-colors ${
                      active ? "bg-night text-white" : "text-slate hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Button href="/contact" variant="dark">
            Get a Quote
          </Button>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-pill bg-ivory ring-1 ring-line lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-white lg:hidden">
          <ul className="container-x flex flex-col py-4">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-xl px-3 py-3 text-base font-medium ${
                    pathname === item.href ? "bg-fog text-night" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Button href="/contact" variant="dark">
                Get a Quote
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
