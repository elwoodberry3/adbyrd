/**
 * Adbyrd — Smart Form Agentics VSL Landing Page
 * Next.js App Router page (server component) · Tailwind CSS · mobile-first
 *
 * Brand tokens (per ADBYRD Global Brand Identity Guidelines):
 *   Byrd Gradient Orange  #FF6B00 → #E04A00   (single accent, CTAs, focal elements)
 *   Slate Charcoal        #5C646D             (body copy, "AD" neutral)
 *   Alpine White          #FFFFFF             (canvas, whitespace)
 *   Obsidian Gray         #1A1D20             (dark sections, premium surfaces)
 *   Type: Inter (loaded in app/layout.tsx)
 *
 * ONE call to action, repeated: "Book a free 15-min call".
 * Set BOOKING_URL to your Calendly / Cal.com link.
 */

const BOOKING_URL = "https://calendly.com/adbyrd/15min"; // ← replace with your real booking link

/* ---------------------------------- CTA ---------------------------------- */

function BookCallButton({
  size = "md",
  className = "",
}: {
  size?: "md" | "lg";
  className?: string;
}) {
  const sizing =
    size === "lg"
      ? "px-8 py-4 text-base"
      : "px-5 py-2.5 text-sm";
  return (
    <a
      href={BOOKING_URL}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#FF6B00] to-[#E04A00] font-semibold text-white shadow-lg shadow-[#FF6B00]/25 transition hover:shadow-xl hover:shadow-[#FF6B00]/30 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 ${sizing} ${className}`}
    >
      Book a free 15-min call
      <svg
        className="h-4 w-4"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}

/* --------------------------------- Pills --------------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-[#FF6B00]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.05em] text-[#E04A00]">
      {children}
    </span>
  );
}

/* ------------------------------ Page ------------------------------------- */

export default function Page() {
  return (
    <main className="min-h-screen bg-[#ECEEF1] px-2 py-2 font-sans text-[#5C646D] antialiased sm:px-4 sm:py-4">
      {/* Rounded page canvas, echoing the reference layout */}
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-white shadow-sm">
        {/* ============================== NAV ============================== */}
        <header className="flex items-center justify-between border-b border-[#1A1D20]/5 px-5 py-4 sm:px-8">
          <a href="#" className="flex items-center gap-2.5">
            {/* Place logo.png in /public */}
            <img src="/logo.png" alt="Adbyrd" className="h-9 w-auto sm:h-10" />
            <span className="text-lg font-semibold tracking-[-0.01em]">
              <span className="text-[#5C646D]">AD</span>
              <span className="text-[#FF6B00]">BYRD</span>
            </span>
          </a>
          <BookCallButton />
        </header>

        {/* ============================== HERO ============================= */}
        <section className="px-5 pb-14 pt-12 text-center sm:px-8 sm:pt-16 lg:pb-20">
          <Eyebrow>Smart Form Agentics</Eyebrow>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.01em] text-[#1A1D20] sm:text-5xl lg:text-6xl">
            Your agency team,{" "}
            <span className="bg-gradient-to-r from-[#FF6B00] to-[#E04A00] bg-clip-text text-transparent">
              always on.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
            Adbyrd builds and operates an AI-native marketing department for
            your business — specialist agents that know your company, remember
            every decision, and execute work around the clock. Watch the short
            overview, then grab a call.
          </p>

          {/* ------------------------- VSL video frame ------------------------ */}
          <div className="relative mx-auto mt-10 max-w-3xl">
            {/* Floating agent-activity cards (desktop/tablet), the dashboard made visible */}
            <div className="pointer-events-none absolute -left-24 top-6 hidden w-52 -rotate-2 rounded-2xl bg-white p-4 text-left shadow-xl ring-1 ring-[#1A1D20]/5 lg:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#5C646D]/70">
                TikTok Specialist
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#1A1D20]">
                <span className="h-2 w-2 rounded-full bg-[#FF6B00] motion-safe:animate-pulse" />
                Online now
              </p>
              <p className="mt-2 text-xs leading-relaxed">
                3 video concepts drafted, waiting on your approval.
              </p>
            </div>

            <div className="pointer-events-none absolute -right-24 bottom-10 hidden w-52 rotate-2 rounded-2xl bg-white p-4 text-left shadow-xl ring-1 ring-[#1A1D20]/5 lg:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#5C646D]/70">
                This week
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-[-0.01em] text-[#1A1D20]">
                142
              </p>
              <p className="text-xs leading-relaxed">
                engagement actions drafted, reviewed, and reported in your
                dashboard.
              </p>
            </div>

            {/* Video shell — drop your Wistia / Vimeo / YouTube iframe inside */}
            <div className="relative aspect-video overflow-hidden rounded-3xl bg-[#1A1D20] shadow-2xl ring-1 ring-[#1A1D20]/10">
              {/* Subtle brand glow */}
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FF6B00]/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#E04A00]/15 blur-3xl" />

              {/* Replace this block with your video embed:
                  <iframe src="..." className="absolute inset-0 h-full w-full" allowFullScreen /> */}
              <a
                href={BOOKING_URL}
                aria-label="Play the Adbyrd overview video"
                className="group absolute inset-0 flex flex-col items-center justify-center gap-4 focus-visible:outline-none"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-[#FF6B00] to-[#E04A00] shadow-lg shadow-[#FF6B00]/40 transition group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-white sm:h-20 sm:w-20">
                  <svg
                    className="ml-1 h-6 w-6 text-white sm:h-7 sm:w-7"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5.5v13l11-6.5-11-6.5z" />
                  </svg>
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.05em] text-white/70">
                  Watch the 3-minute overview
                </span>
              </a>
            </div>

            {/* Mobile stat strip (replaces floating cards on small screens) */}
            <div className="mt-4 flex items-center justify-center gap-6 text-xs lg:hidden">
              <span className="flex items-center gap-1.5 font-medium text-[#1A1D20]">
                <span className="h-2 w-2 rounded-full bg-[#FF6B00] motion-safe:animate-pulse" />
                Agents online 24/7
              </span>
              <span className="font-medium text-[#1A1D20]">
                142 actions drafted this week
              </span>
            </div>
          </div>

          {/* Single CTA */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <BookCallButton size="lg" />
            <p className="text-xs text-[#5C646D]/70">
              No pitch deck. No pressure. 15 minutes to see if it fits.
            </p>
          </div>
        </section>

        {/* ======================= AGENT TEAM STRIP ======================== */}
        <section className="border-y border-[#1A1D20]/5 bg-[#FAFBFC] px-5 py-10 sm:px-8">
          <p className="text-center text-sm font-medium text-[#1A1D20]">
            One subscription. A full specialist team on your account.
          </p>
          <ul className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold uppercase tracking-[0.05em] text-[#5C646D]/70">
            <li>TikTok Specialist</li>
            <li>Content Strategist</li>
            <li>SEO Specialist</li>
            <li>Outbound Engagement</li>
            <li>Graphic Designer</li>
            <li>Reporting Agent</li>
          </ul>
        </section>

        {/* ========================== WHAT YOU GET ========================= */}
        <section className="px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-12">
            <div>
              <Eyebrow>What you get</Eyebrow>
              <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight tracking-[-0.01em] text-[#1A1D20] sm:text-4xl">
                A marketing department inside your dashboard.
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed lg:justify-self-end">
              Not another tool to learn. A team that already knows your brand,
              works while you sleep, and shows you exactly what it did — with a
              human approving anything public before it ships.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-3xl border border-[#1A1D20]/5 bg-white p-7 shadow-sm transition hover:shadow-md">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6B00]/10">
                <svg className="h-6 w-6 text-[#E04A00]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3l2.4 4.9L20 9l-4 3.9.9 5.4L12 15.8 7.1 18.3 8 12.9 4 9l5.6-1.1L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-[#1A1D20]">
                Specialist agents, not a chatbot
              </h3>
              <p className="mt-2 text-sm leading-relaxed">
                Open your account and talk to the right expert — a TikTok
                strategist, a designer, an SEO lead. Each one has a defined
                role, taste, and workflow authority. No cold starts, no
                repeating your business basics.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-[#1A1D20]/5 bg-white p-7 shadow-sm transition hover:shadow-md">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5C646D]/10">
                <svg className="h-6 w-6 text-[#5C646D]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 21c4.97 0 9-1.79 9-4V7M12 21c-4.97 0-9-1.79-9-4V7m18 0c0 2.21-4.03 4-9 4S3 9.21 3 7m18 0c0-2.21-4.03-4-9-4S3 4.79 3 7m18 5c0 2.21-4.03 4-9 4s-9-1.79-9-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-[#1A1D20]">
                Memory that compounds
              </h3>
              <p className="mt-2 text-sm leading-relaxed">
                Every conversation, decision, asset, and approval is logged to
                your client intelligence layer. The team gets sharper the
                longer you work together — your strategy history never walks
                out the door.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-[#1A1D20]/5 bg-white p-7 shadow-sm transition hover:shadow-md sm:col-span-2 lg:col-span-1">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1A1D20]/5">
                <svg className="h-6 w-6 text-[#1A1D20]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 19V10m6 9V5m6 14v-6m4 6H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-[#1A1D20]">
                Work you can see
              </h3>
              <p className="mt-2 text-sm leading-relaxed">
                Comments drafted, scripts written, posts planned, competitors
                monitored — every action lands in your dashboard with an
                approval queue. Human-governed, brand-safe, and visible in
                real time.
              </p>
            </div>
          </div>
        </section>

        {/* ========================= HOW THE CALL WORKS ==================== */}
        <section className="border-t border-[#1A1D20]/5 bg-[#FAFBFC] px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>The 15-minute call</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.01em] text-[#1A1D20] sm:text-4xl">
              Fifteen minutes. Three things. Zero obligation.
            </h2>
          </div>

          <ol className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
            <li className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#1A1D20]/5">
              <span className="text-sm font-semibold text-[#FF6B00]">01</span>
              <h3 className="mt-3 text-base font-semibold text-[#1A1D20]">
                We learn your business
              </h3>
              <p className="mt-2 text-sm leading-relaxed">
                Your offers, your audience, and where marketing stalls out
                today.
              </p>
            </li>
            <li className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#1A1D20]/5">
              <span className="text-sm font-semibold text-[#FF6B00]">02</span>
              <h3 className="mt-3 text-base font-semibold text-[#1A1D20]">
                You see the team live
              </h3>
              <p className="mt-2 text-sm leading-relaxed">
                A quick walkthrough of the specialist agents and dashboard —
                the same system we run Adbyrd on.
              </p>
            </li>
            <li className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#1A1D20]/5">
              <span className="text-sm font-semibold text-[#FF6B00]">03</span>
              <h3 className="mt-3 text-base font-semibold text-[#1A1D20]">
                You get a straight answer
              </h3>
              <p className="mt-2 text-sm leading-relaxed">
                If it's a fit, we map your first agent team. If not, we tell
                you — and you keep the ideas.
              </p>
            </li>
          </ol>
        </section>

        {/* ============================ FINAL CTA ========================== */}
        <section className="px-5 py-14 sm:px-8 lg:py-20">
          <div className="relative overflow-hidden rounded-3xl bg-[#1A1D20] px-6 py-14 text-center sm:px-12 lg:py-20">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#FF6B00]/15 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[#E04A00]/15 blur-3xl" />

            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.01em] text-white sm:text-4xl">
                Your competitors' marketing team goes home at five.{" "}
                <span className="bg-gradient-to-r from-[#FF6B00] to-[#E04A00] bg-clip-text text-transparent">
                  Yours doesn't have to.
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/60">
                One call is all it takes to see the always-on agency model in
                action.
              </p>
              <div className="mt-8">
                <BookCallButton size="lg" />
              </div>
            </div>
          </div>
        </section>

        {/* ============================== FOOTER =========================== */}
        <footer className="flex flex-col items-center justify-between gap-4 border-t border-[#1A1D20]/5 px-5 py-8 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="h-7 w-auto" />
            <span className="text-sm font-semibold tracking-[-0.01em]">
              <span className="text-[#5C646D]">AD</span>
              <span className="text-[#FF6B00]">BYRD</span>
            </span>
          </div>
          <p className="text-xs text-[#5C646D]/60">
            © {new Date().getFullYear()} Adbyrd, LLC. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
