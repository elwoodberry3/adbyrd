import { Bot, ShieldCheck, Sparkles } from "lucide-react";

/**
 * The hero centerpiece: a glowing "agentic core" built from SVG + CSS only,
 * surrounded by floating glass feature cards (Ref 003 treatment).
 */
export default function AICore() {
  const nodes = Array.from({ length: 10 }).map((_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return { x: 200 + Math.cos(a) * 150, y: 200 + Math.sin(a) * 150, big: i % 3 === 0 };
  });

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      {/* Ambient glow */}
      <div className="animate-pulse-glow absolute inset-[14%] rounded-full bg-glow/40 blur-[70px]" />
      <div className="absolute inset-[30%] rounded-full bg-lime/30 blur-[50px]" />

      <svg viewBox="0 0 400 400" className="relative h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="core" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#f4ffd6" />
            <stop offset="35%" stopColor="#c9f26b" />
            <stop offset="75%" stopColor="#1f6b52" />
            <stop offset="100%" stopColor="#0d3328" />
          </radialGradient>
          <linearGradient id="ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#45e3c2" />
            <stop offset="100%" stopColor="#c9f26b" />
          </linearGradient>
        </defs>

        {/* Outer orbit with nodes */}
        <g className="animate-spin-slow origin-center" style={{ transformBox: "fill-box" }}>
          <circle cx="200" cy="200" r="150" fill="none" stroke="url(#ring)" strokeOpacity="0.35" strokeDasharray="2 8" />
          {nodes.map((n, i) => (
            <g key={i}>
              <line x1="200" y1="200" x2={n.x} y2={n.y} stroke="#45e3c2" strokeOpacity="0.12" />
              <circle cx={n.x} cy={n.y} r={n.big ? 6 : 3.5} fill={n.big ? "#c9f26b" : "#45e3c2"} />
              {n.big && <circle cx={n.x} cy={n.y} r="14" fill="#c9f26b" fillOpacity="0.15" />}
            </g>
          ))}
        </g>

        {/* Middle counter-rotating ring */}
        <g className="animate-spin-rev origin-center" style={{ transformBox: "fill-box" }}>
          <circle cx="200" cy="200" r="108" fill="none" stroke="#c9f26b" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="60 18 4 18" />
          <circle cx="200" cy="200" r="122" fill="none" stroke="#45e3c2" strokeOpacity="0.25" strokeDasharray="1 5" />
        </g>

        {/* Core */}
        <circle cx="200" cy="200" r="84" fill="#08201a" stroke="#45e3c2" strokeOpacity="0.4" />
        <circle cx="200" cy="200" r="66" fill="url(#core)" />
        <circle cx="200" cy="200" r="66" fill="none" stroke="#f4ffd6" strokeOpacity="0.5" />
        <g stroke="#08201a" strokeOpacity="0.55" strokeWidth="1.2" fill="none">
          <path d="M170 200h18l8-14 10 28 8-14h16" />
        </g>
        <ellipse cx="184" cy="176" rx="20" ry="9" fill="#ffffff" fillOpacity="0.35" transform="rotate(-25 184 176)" />
      </svg>

      {/* Floating glass cards */}
      <div className="glass animate-float absolute top-[4%] -left-2 rounded-2xl p-4 text-white shadow-2xl shadow-black/30 sm:left-0">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime text-ink">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] tracking-wider text-white/60 uppercase">Capability</p>
            <p className="text-sm font-semibold">Agentic AI Development</p>
          </div>
        </div>
      </div>

      <div
        className="glass animate-float absolute right-0 bottom-[16%] max-w-[210px] rounded-2xl p-4 text-white shadow-2xl shadow-black/30"
        style={{ animationDelay: "1.6s" }}
      >
        <div className="mb-2 flex items-center gap-2 text-lime">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-[11px] font-semibold tracking-wider uppercase">Human oversight</span>
        </div>
        <p className="text-sm leading-snug text-white/85">Maintain human approvals and operational visibility.</p>
      </div>

      <div
        className="glass animate-float absolute bottom-[2%] left-[6%] rounded-full px-4 py-2 text-white shadow-xl shadow-black/30"
        style={{ animationDelay: "3s" }}
      >
        <span className="inline-flex items-center gap-2 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-lime" /> Intelligence, Engineered.
        </span>
      </div>
    </div>
  );
}
