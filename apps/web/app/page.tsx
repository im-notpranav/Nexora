import Link from "next/link";
import { NexoraMark } from "@/components/nexora-mark";

const STEPS = [
  {
    title: "Describe it",
    text: "Explain your app idea in your own words. We turn it into a plan you approve.",
  },
  {
    title: "Pick a look",
    text: "Choose from 18 styles and your own brand colors, previewed on your app.",
  },
  {
    title: "Get it live",
    text: "We build, check and deploy it to your own GitHub, Supabase and Vercel.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col gap-16 px-4 py-8 md:px-8">
      <header className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-2">
          <NexoraMark />
          <span className="type-heading text-lg">Nexora</span>
        </span>
        <nav aria-label="Main" className="flex items-center gap-2">
          <Link
            href="/gallery"
            className="inline-flex h-control items-center rounded-control px-4 text-sm font-semibold text-ink hover:bg-surface-2"
          >
            Style gallery
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex h-control items-center rounded-control bg-primary px-4 text-sm font-semibold text-on-primary hover:bg-primary-hover"
          >
            Sign in
          </Link>
        </nav>
      </header>

      <main className="flex flex-col gap-12">
        <section className="flex max-w-2xl flex-col gap-4">
          <h1 className="type-heading text-4xl">Describe an app. Get a working one you own.</h1>
          <p className="text-lg text-ink-muted">
            Nexora plans, builds, checks and deploys a full web app from your description, using
            your own free AI keys. The code, data and hosting stay in your accounts.
          </p>
        </section>
        <ol className="grid grid-cols-1 gap-theme md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="surface-card flex flex-col gap-2 p-card">
              <span className="type-numeric text-sm text-primary-ink">Step {i + 1}</span>
              <h2 className="type-heading text-lg">{step.title}</h2>
              <p className="text-sm text-ink-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
