import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="text-sm font-semibold tracking-[0.18em] text-moss uppercase">404</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">This page hasn&apos;t been built yet.</h1>
      <p className="mt-4 max-w-lg text-lg text-slate">The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on track.</p>
      <div className="mt-8">
        <Button href="/" variant="dark">Back to Home</Button>
      </div>
    </section>
  );
}
