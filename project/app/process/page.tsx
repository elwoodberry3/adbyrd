import type { Metadata } from "next";
import {
  CalendarCheck,
  FileText,
  GitPullRequestArrow,
  LifeBuoy,
  MessagesSquare,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button, CtaBand, PageHero, SectionHeading } from "@/components/ui";
import { accountability, stages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Development Process",
  description:
    "The Adbyrd Development Framework: eight stages from discovery to ongoing partnership, with accountability and responsible agentic engineering built in.",
};

const accIcons = [CalendarCheck, MessagesSquare, FileText, GitPullRequestArrow, ShieldCheck, LifeBuoy];

export default function ProcessPage() {
  return (
    <>
      <PageHero
        kicker="A Better Way to Build."
        eyebrow="The Adbyrd Development Framework"
        title="Big Ideas Need More Than Great Code. They Need a Plan."
        aside={
          <ol className="glass space-y-1 rounded-[1.75rem] p-6">
            {stages.map((s, i) => (
              <li key={s.label} className="flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm">
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-xs font-semibold ${
                    i === 0 ? "bg-lime text-ink" : "bg-white/10 text-white"
                  }`}
                >
                  0{i + 1}
                </span>
                <span className="font-medium text-white/85">{s.label}</span>
              </li>
            ))}
          </ol>
        }
      >
        <p>
          Every successful digital product begins with a clear understanding of what needs to be accomplished, why it
          matters, and how success will be measured.
        </p>
        <p className="text-base text-white/65">
          Our development approach brings strategy, design, engineering, testing, and ongoing improvement together into a
          structured, collaborative process.
        </p>
        <p className="text-base text-white/65">
          No unnecessary guesswork. No mysterious development black box. A clear path from concept to capability.
        </p>
        <div className="pt-4">
          <Button href="/contact">Start With Discovery</Button>
        </div>
      </PageHero>

      {/* Eight stages — timeline */}
      <section className="container-x py-20 lg:py-28">
        <SectionHeading center eyebrow="The Eight Stages" title="A Clear Path From Concept to Capability." />
        <ol className="relative mx-auto mt-16 max-w-5xl">
          <span className="absolute top-2 bottom-2 left-[23px] w-px bg-line md:left-1/2" aria-hidden="true" />
          {stages.map((s, i) => {
            const right = i % 2 === 1;
            return (
              <li key={s.label} className="relative pb-10 pl-16 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
                <span className="absolute top-0 left-0 z-10 grid h-12 w-12 place-items-center rounded-full bg-forest font-display text-sm font-semibold text-lime ring-8 ring-white md:left-1/2 md:-translate-x-1/2">
                  0{i + 1}
                </span>
                <div className={right ? "md:col-start-2" : "md:col-start-1 md:text-right"}>
                  <div className="rounded-[1.5rem] bg-white p-7 text-left ring-1 ring-line transition-shadow hover:shadow-xl hover:shadow-forest/5">
                    <p className="text-xs font-semibold tracking-[0.16em] text-moss uppercase">{s.label}</p>
                    <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
                    <p className="mt-3 leading-relaxed text-slate">{s.body}</p>
                    <div className="mt-5 flex items-start gap-2 rounded-xl bg-mint px-4 py-3 text-sm">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-moss" />
                      <p>
                        <span className="font-semibold text-forest">Your outcome: </span>
                        {s.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Accountability */}
      <section className="bg-cloud py-20 lg:py-28">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <SectionHeading
              eyebrow="Engineered for Accountability"
              title="You Should Never Have to Wonder What's Happening With Your Project."
            />
            <div className="space-y-3 text-lg leading-relaxed text-slate">
              <p>
                A successful partnership requires more than technical talent. It requires consistent communication, clear
                expectations, and an agreed definition of success.
              </p>
              <p className="font-medium text-ink">Our delivery model is designed around visibility and shared accountability.</p>
            </div>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {accountability.map((a, i) => {
              const Icon = accIcons[i];
              return (
                <div key={a.title} className="rounded-[1.5rem] bg-white p-8 ring-1 ring-line">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-forest text-lime">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold">{a.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate">{a.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Responsible Agentic Engineering */}
      <section className="px-3 py-3 sm:px-5">
        <div className="relative overflow-hidden rounded-[2rem] bg-forest text-white">
          <div className="grid-fade pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-glow/20 blur-[130px]" />
          <div className="container-x relative grid gap-14 py-20 lg:grid-cols-2 lg:py-28">
            <div>
              <SectionHeading
                light
                eyebrow="Responsible Agentic Engineering"
                title="Autonomy Without Oversight Isn't Innovation. It's Risk."
              />
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-white/75">
                <p>
                  AI agents introduce capabilities traditional applications were never designed to perform. They can select
                  tools, process unstructured information, and execute sequences of actions.
                </p>
                <p>That flexibility requires disciplined engineering.</p>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-10">
              <ul className="grid gap-3 sm:grid-cols-2">
                {[
                  "Clear agent responsibilities",
                  "Controlled permissions",
                  "Human approval for sensitive actions",
                  "Secure handling of business data",
                  "Evaluation against defined tasks",
                  "The ability to investigate failures",
                ].map((t) => (
                  <li key={t} className="glass rounded-2xl px-5 py-4 text-sm font-medium">
                    {t}
                  </li>
                ))}
              </ul>
              <div className="border-l-4 border-lime pl-6">
                <p className="text-lg text-white/70">The goal isn&apos;t maximum autonomy.</p>
                <p className="mt-1 font-display text-2xl font-semibold text-lime sm:text-3xl">
                  It&apos;s the right level of autonomy for the job.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="From First Conversation to First Deployment. Know What Comes Next."
        body={
          <p>
            Whether your project is a new application, an automation initiative, or a sophisticated AI system, we&apos;ll help
            identify a practical development path.
          </p>
        }
        primary={{ href: "/contact", label: "Discuss Your Project" }}
      />
    </>
  );
}
