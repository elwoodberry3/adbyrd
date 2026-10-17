import { Bot, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Hero centerpiece: a close-up of the Adbyrd Sentinel (from the character sheet)
 * inside the orbiting "agentic" rings, scanning three floating glass cards.
 * Pure SVG + CSS — no image assets, scales crisply, respects reduced motion.
 */

const C = {
  ink: "#121726",
  dark: "#24212a",
  metal: "#3a3741",
  mist: "#a8bfc0",
  cream: "#dad4be",
  ember: "#e07a3f",
};

// Card anchor points in the 400×400 viewBox (must match card positions below)
const LENS = { x: 214, y: 206 };
const TARGETS = [
  { x: 222, y: 82 }, // Capability (top-right)
  { x: 234, y: 298 }, // Human oversight (bottom-right)
  { x: 150, y: 318 }, // Intelligence, Engineered. (bottom-left)
];

export default function AICore({ showCards = true }: { showCards?: boolean }) {
  const nodes = Array.from({ length: 12 }).map((_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return { x: 200 + Math.cos(a) * 168, y: 200 + Math.sin(a) * 168, big: i % 4 === 0, warm: i === 4 };
  });

  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <div className="relative aspect-square">
      {/* Ambient fog glow (the character sheet's misty backdrop) */}
      <div className="animate-pulse-mist absolute inset-[10%] rounded-full bg-mist/30 blur-[70px]" />
      <div className="absolute inset-[34%] rounded-full bg-cream/25 blur-[50px]" />

      <svg viewBox="0 0 400 400" className="relative h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="sn-shell" x1="0.15" y1="0.05" x2="0.85" y2="0.95">
            <stop offset="0%" stopColor="#f6f2e6" />
            <stop offset="45%" stopColor="#ddd6c2" />
            <stop offset="100%" stopColor="#a39a87" />
          </linearGradient>
          <radialGradient id="sn-shell-shade" cx="0.25" cy="0.25" r="0.9">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#1c2433" stopOpacity="0.35" />
          </radialGradient>
          <linearGradient id="sn-cap" x1="0.2" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#e3a079" />
            <stop offset="50%" stopColor="#c97a4c" />
            <stop offset="100%" stopColor="#8a4d2e" />
          </linearGradient>
          <radialGradient id="sn-bezel" cx="0.4" cy="0.35" r="0.7">
            <stop offset="0%" stopColor="#efe9d8" />
            <stop offset="100%" stopColor="#b2aa95" />
          </radialGradient>
          <radialGradient id="sn-glass" cx="0.42" cy="0.38" r="0.7">
            <stop offset="0%" stopColor="#33475a" />
            <stop offset="60%" stopColor="#16202c" />
            <stop offset="100%" stopColor="#0a0e14" />
          </radialGradient>
          <radialGradient id="sn-pupil" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ffd2a8" />
            <stop offset="45%" stopColor={C.ember} />
            <stop offset="100%" stopColor={C.ember} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sn-ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={C.mist} />
            <stop offset="100%" stopColor={C.cream} />
          </linearGradient>
          <clipPath id="sn-shell-clip">
            <path d={SHELL} />
          </clipPath>
        </defs>

        {/* Outer orbit with nodes */}
        <g className="animate-spin-slow" style={{ transformOrigin: "200px 200px" }}>
          <circle cx="200" cy="200" r="168" fill="none" stroke="url(#sn-ring)" strokeOpacity="0.35" strokeDasharray="2 8" />
          {nodes.map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={n.big ? 5 : 3} fill={n.warm ? C.ember : n.big ? C.cream : C.mist} />
              {n.big && <circle cx={n.x} cy={n.y} r="12" fill={n.warm ? C.ember : C.cream} fillOpacity="0.14" />}
            </g>
          ))}
        </g>

        {/* Counter-rotating ring */}
        <g className="animate-spin-rev" style={{ transformOrigin: "200px 200px" }}>
          <circle cx="200" cy="200" r="138" fill="none" stroke={C.cream} strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="60 18 4 18" />
          <circle cx="200" cy="200" r="150" fill="none" stroke={C.mist} strokeOpacity="0.22" strokeDasharray="1 5" />
        </g>

        {/* Neck mechanics */}
        <g stroke={C.dark} strokeLinecap="round" fill="none">
          <path d="M196 282 L188 410" strokeWidth="9" />
          <path d="M214 286 L222 410" strokeWidth="7" />
          <path d="M204 290 C 176 320, 232 344, 200 378 S 186 404, 196 420" strokeWidth="2.5" stroke="#4a4652" />
          <path d="M222 292 C 240 318, 206 350, 230 384" strokeWidth="2" stroke="#5a5662" />
          <path d="M184 300 C 170 330, 190 350, 176 392" strokeWidth="2" stroke="#4a4652" />
          <rect x="190" y="318" width="26" height="14" rx="3" fill={C.metal} stroke="none" />
          <rect x="186" y="352" width="34" height="10" rx="3" fill={C.metal} stroke="none" />
          <circle cx="203" cy="325" r="3" fill={C.cream} stroke="none" opacity="0.6" />
          <ellipse cx="206" cy="290" rx="34" ry="9" fill={C.metal} stroke="none" />
          <ellipse cx="206" cy="287" rx="28" ry="6" fill="#4a4652" stroke="none" />
        </g>

        {/* Head (gently looks between targets) */}
        <g className="animate-look" style={{ transformOrigin: "205px 285px" }}>
          {/* Rear ear/hinge module */}
          <g>
            <rect x="98" y="190" width="26" height="34" rx="7" fill={C.dark} />
            <circle cx="96" cy="207" r="10" fill={C.metal} />
            <circle cx="92" cy="207" r="5" fill={C.dark} />
            <rect x="112" y="178" width="10" height="58" rx="4" fill="#2f2c35" />
          </g>

          {/* Antenna */}
          <g strokeLinecap="round">
            <path d="M160 124 L151 66" stroke={C.dark} strokeWidth="6" />
            <path d="M157 106 L154 86" stroke="#5a5662" strokeWidth="2" />
            <path d="M151 66 L145 16" stroke="#8b9097" strokeWidth="1.6" />
            <circle cx="145" cy="15" r="3.2" fill={C.ember} className="animate-blink" />
          </g>

          {/* Shell */}
          <path d={SHELL} fill="url(#sn-shell)" />
          <g clipPath="url(#sn-shell-clip)">
            <path d={SHELL} fill="url(#sn-shell-shade)" />
            {/* Orange crown + back cap */}
            <path d="M150 40 L360 40 L360 300 L314 236 C 306 170 266 122 168 112 Z" fill="url(#sn-cap)" />
            {/* Visor seam (dark gap under the cap) */}
            <path d="M168 112 C 266 122 306 170 314 236" fill="none" stroke={C.dark} strokeWidth="6" />
            <path d="M171 118 C 262 128 300 174 308 236" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.2" />
            {/* Cap panel seam + wear */}
            <path d="M246 104 C 272 118 296 142 308 170" fill="none" stroke="#7a3f22" strokeOpacity="0.55" strokeWidth="1.3" />
            <circle cx="282" cy="132" r="1.6" fill="#7a3518" opacity="0.6" />
            <circle cx="311" cy="204" r="1.3" fill="#7a3518" opacity="0.5" />
            {/* Shell panel lines */}
            <path d="M126 236 C 160 262 226 276 290 262" fill="none" stroke="#7d7564" strokeOpacity="0.5" strokeWidth="1.2" />
            <path d="M138 150 C 130 170 128 196 132 220" fill="none" stroke="#7d7564" strokeOpacity="0.35" strokeWidth="1" />
            {/* Jaw underside */}
            <path d="M138 262 C 180 284 236 296 282 280 L 300 300 L 120 300 Z" fill={C.dark} opacity="0.85" />
          </g>
          {/* Small side sensor + visor dot */}
          <circle cx="152" cy="214" r="10" fill={C.dark} />
          <circle cx="152" cy="214" r="5.5" fill="#3d3a44" />
          <circle cx="150" cy="212" r="1.6" fill="#fff" opacity="0.5" />
          <circle cx="300" cy="246" r="3.5" fill={C.dark} />

          {/* Lens assembly */}
          <g>
            <ellipse cx={LENS.x} cy={LENS.y} rx="52" ry="49" fill={C.dark} />
            <circle cx={LENS.x} cy={LENS.y} r="41" fill="url(#sn-bezel)" />
            <circle cx={LENS.x} cy={LENS.y} r="41" fill="none" stroke="#8c846f" strokeWidth="1" />
            <circle cx={LENS.x} cy={LENS.y} r="33" fill={C.dark} />
            <circle cx={LENS.x} cy={LENS.y} r="27" fill="url(#sn-glass)" />
            <circle cx={LENS.x} cy={LENS.y} r="20" fill="none" stroke={C.mist} strokeOpacity="0.35" strokeDasharray="3 3" />
            {/* Iris — pulses while analyzing */}
            <g className="animate-iris" style={{ transformOrigin: `${LENS.x}px ${LENS.y}px` }}>
              <circle cx={LENS.x} cy={LENS.y} r="14" fill="url(#sn-pupil)" />
              <circle cx={LENS.x} cy={LENS.y} r="4.5" fill="#fff4e8" />
            </g>
            <ellipse cx={LENS.x - 11} cy={LENS.y - 12} rx="8" ry="4.5" fill="#fff" opacity="0.35" transform={`rotate(-30 ${LENS.x - 11} ${LENS.y - 12})`} />
            <circle cx={LENS.x + 12} cy={LENS.y + 11} r="2" fill="#fff" opacity="0.25" />
          </g>
        </g>

        {/* Scan beams to each card (desktop layout only) */}
        <g fill="none" strokeLinecap="round" className={showCards ? "hidden sm:inline" : "hidden"}>
          {TARGETS.map((t, i) => (
            <g key={i}>
              <line
                x1={LENS.x}
                y1={LENS.y}
                x2={t.x}
                y2={t.y}
                stroke={C.mist}
                strokeOpacity="0.55"
                strokeWidth="1.2"
                strokeDasharray="2 6"
                className="animate-dash"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
              <circle cx={t.x} cy={t.y} r="4" fill={C.ember} />
              <circle cx={t.x} cy={t.y} r="9" stroke={C.ember} strokeOpacity="0.5" />
            </g>
          ))}
        </g>
      </svg>
      </div>

      {/* Floating glass cards being analyzed — stacked under the Sentinel on phones */}
      <div className={showCards ? "mt-2 flex flex-col items-start gap-3 sm:mt-0 sm:contents" : "hidden"}>
      <ScanCard className="sm:top-[1%] sm:right-0" delay="0s">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-pill bg-cream text-ink">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] tracking-wider text-white/60 uppercase">Answering now</p>
            <p className="text-sm font-semibold">AI Phone Receptionist</p>
          </div>
        </div>
      </ScanCard>

      <ScanCard className="sm:right-0 sm:bottom-[2%] sm:max-w-[220px]" delay="1.2s">
        <div className="mb-2 flex items-center gap-2 text-mist">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-[11px] font-semibold tracking-wider uppercase">You stay in charge</span>
        </div>
        <p className="text-sm leading-snug text-white/85">Unusual calls go straight to you, with a text summary.</p>
      </ScanCard>

      <ScanCard className="sm:bottom-[10%] sm:left-0" delay="2.4s" pill>
        <span className="inline-flex items-center gap-2 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-ember" /> Intelligence, Engineered.
        </span>
      </ScanCard>
      </div>
    </div>
  );
}

function ScanCard({
  children,
  className,
  delay,
  pill = false,
}: {
  children: ReactNode;
  className: string;
  delay: string;
  pill?: boolean;
}) {
  return (
    <div className={`animate-float relative sm:absolute ${className}`} style={{ animationDelay: delay }}>
      <div className={`glass relative text-white shadow-2xl shadow-black/30 ${pill ? "rounded-pill px-4 py-2.5" : "rounded-lg p-4"}`}>
        {/* Targeting brackets */}
        <span className="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-mist/80" />
        <span className="absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-mist/80" />
        <span className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-mist/80" />
        <span className="absolute -right-1 -bottom-1 h-3 w-3 border-r-2 border-b-2 border-mist/80" />
        {children}
        {!pill && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-[0.16em] text-mist/80 uppercase">Analyzing</span>
            <span className="h-1 flex-1 overflow-hidden rounded-pill bg-white/10">
              <span className="animate-scanbar block h-full rounded-pill bg-mist" style={{ animationDelay: delay }} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Helmet silhouette — facing right, crown/back cap, beak-like chin (per character sheet)
const SHELL =
  "M120 206 C 116 140 164 98 226 98 C 286 98 318 142 318 192 C 318 226 306 252 290 268 L 282 280 C 236 296 176 286 144 268 C 128 258 121 236 120 206 Z";
