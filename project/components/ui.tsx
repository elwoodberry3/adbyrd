import Link from "next/link";
import type { ReactNode } from "react";
import {
  Activity,
  ArrowUpRight,
  Bot,
  Code2,
  PenTool,
  PlugZap,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/lib/content";

export const icons: Record<IconName, LucideIcon> = {
  bot: Bot,
  code: Code2,
  workflow: Workflow,
  plug: PlugZap,
  pen: PenTool,
  activity: Activity,
};

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill={light ? "#c9f26b" : "#0d3328"} />
        {/* Abstract wing/arrow mark */}
        <path
          d="M9 27c6.5-1 11-5.2 13.4-12.6L31 11l-3.6 8.4c-2.7 6.3-8.6 9.3-18.4 7.6Z"
          fill={light ? "#0d3328" : "#c9f26b"}
        />
        <circle cx="27.5" cy="13.5" r="1.6" fill={light ? "#c9f26b" : "#0d3328"} />
      </svg>
      <span className={`font-display text-xl font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Adbyrd
      </span>
    </span>
  );
}

type BtnProps = {
  href: string;
  children: ReactNode;
  variant?: "lime" | "dark" | "outline" | "outline-light";
  className?: string;
};

export function Button({ href, children, variant = "lime", className = "" }: BtnProps) {
  const styles = {
    lime: "bg-lime text-ink hover:bg-lime-2",
    dark: "bg-forest text-white hover:bg-forest-2",
    outline: "border border-forest/25 text-forest hover:border-forest hover:bg-forest hover:text-white",
    "outline-light": "border border-white/30 text-white hover:border-lime hover:text-lime",
  }[variant];
  const dot = {
    lime: "bg-ink text-lime",
    dark: "bg-lime text-ink",
    outline: "bg-forest text-lime",
    "outline-light": "bg-white/15 text-white",
  }[variant];
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full py-2 pr-2 pl-5 text-sm font-semibold transition-colors ${styles} ${className}`}
    >
      {children}
      <span className={`grid h-8 w-8 place-items-center rounded-full transition-transform group-hover:rotate-45 ${dot}`}>
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function Eyebrow({ children, light = false, center = false }: { children: ReactNode; light?: boolean; center?: boolean }) {
  return (
    <p
      className={`mb-4 flex items-center gap-2 text-xs ${center ? "justify-center" : ""} font-semibold tracking-[0.18em] uppercase ${
        light ? "text-lime" : "text-moss"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${light ? "bg-lime" : "bg-moss"}`} />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <Eyebrow light={light} center={center}>{eyebrow}</Eyebrow>}
      <h2 className={`text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem] ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      <div className={`mt-4 h-1 w-14 rounded-full bg-lime ${center ? "mx-auto" : ""}`} />
      {intro && <div className={`mt-5 text-lg leading-relaxed ${light ? "text-white/75" : "text-slate"}`}>{intro}</div>}
    </div>
  );
}

/** Compact dark hero used by inner pages. */
export function PageHero({
  eyebrow,
  kicker,
  title,
  children,
  aside,
}: {
  eyebrow: string;
  kicker: string;
  title: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="px-3 pt-3 sm:px-5">
      <div className="relative overflow-hidden rounded-[2rem] bg-forest text-white">
        <div className="grid-fade pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-glow/25 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-48 left-[-10%] h-[420px] w-[420px] rounded-full bg-lime/15 blur-[110px]" />
        <div className="container-x relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <span className="glass mb-6 inline-block rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-lime">
              {kicker}
            </span>
            <Eyebrow light>{eyebrow}</Eyebrow>
            <h1 className="text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">{title}</h1>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-white/75">{children}</div>
          </div>
          {aside && <div className="relative hidden lg:block">{aside}</div>}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({
  title,
  body,
  primary,
  secondary,
}: {
  title: string;
  body?: ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="px-3 pb-3 sm:px-5">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_0%,rgb(69_227_194/0.25),transparent_55%),radial-gradient(ellipse_at_0%_100%,rgb(201_242_107/0.18),transparent_50%)]" />
        <div className="container-x relative flex flex-col items-start justify-between gap-8 py-16 sm:py-20 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-3xl leading-tight font-semibold sm:text-4xl">{title}</h2>
            {body && <div className="mt-4 space-y-2 text-lg text-white/70">{body}</div>}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={primary.href}>{primary.label}</Button>
            {secondary && (
              <Button href={secondary.href} variant="outline-light">
                {secondary.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Arch-framed abstract visual (no image assets needed). */
export function ArchVisual({ variant = "circuit", className = "" }: { variant?: "circuit" | "waves" | "nodes"; className?: string }) {
  return (
    <div className={`arch relative overflow-hidden bg-forest ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgb(69_227_194/0.45),transparent_60%)]" />
      <svg viewBox="0 0 300 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {variant === "circuit" && (
          <g stroke="#c9f26b" strokeOpacity="0.55" fill="none" strokeWidth="1.4">
            {Array.from({ length: 9 }).map((_, i) => (
              <path key={i} d={`M${20 + i * 32} 420 V${300 - (i % 3) * 40} h${i % 2 ? 22 : -22} V${150 + (i % 4) * 25}`} />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <circle key={`c${i}`} cx={20 + i * 32 + (i % 2 ? 22 : -22)} cy={150 + (i % 4) * 25} r="3.5" fill="#c9f26b" />
            ))}
            <rect x="105" y="190" width="90" height="90" rx="14" stroke="#45e3c2" strokeOpacity="0.9" fill="#08201a" fillOpacity="0.6" />
            <rect x="125" y="210" width="50" height="50" rx="8" fill="#c9f26b" fillOpacity="0.85" stroke="none" />
          </g>
        )}
        {variant === "waves" && (
          <g fill="none" strokeWidth="1.3">
            {Array.from({ length: 14 }).map((_, i) => (
              <path
                key={i}
                d={`M0 ${120 + i * 20} C 80 ${70 + i * 22}, 200 ${190 + i * 16}, 300 ${110 + i * 20}`}
                stroke={i % 3 === 0 ? "#c9f26b" : "#45e3c2"}
                strokeOpacity={0.25 + (i % 4) * 0.12}
              />
            ))}
          </g>
        )}
        {variant === "nodes" && (
          <g>
            {[
              [150, 150, 230, 230],
              [150, 150, 70, 240],
              [230, 230, 160, 330],
              [70, 240, 160, 330],
              [150, 150, 210, 80],
              [70, 240, 40, 340],
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#45e3c2" strokeOpacity="0.6" strokeWidth="1.4" />
            ))}
            {[
              [150, 150, 14],
              [230, 230, 9],
              [70, 240, 10],
              [160, 330, 12],
              [210, 80, 7],
              [40, 340, 6],
            ].map(([cx, cy, r], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r={r * 2.4} fill="#45e3c2" fillOpacity="0.12" />
                <circle cx={cx} cy={cy} r={r} fill={i === 0 ? "#c9f26b" : "#45e3c2"} />
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
