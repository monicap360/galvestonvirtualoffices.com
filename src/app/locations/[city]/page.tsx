import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LOCATIONS, getLocation } from "@/lib/locations";

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ city: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const loc = getLocation(city);
  if (!loc) return { title: "Locations" };
  return {
    title: loc.headline,
    description: loc.metaDescription,
    alternates: { canonical: `/locations/${loc.slug}` },
  };
}

const services = [
  { href: "/mailboxes", t: "Virtual mailbox & packages", d: "A real street address with mail + package acceptance (Amazon, UPS, FedEx), AI sorting, and local pickup." },
  { href: "/virtual-assistants", t: "Managed virtual assistants", d: "Dedicated, vetted assistants we recruit and manage for you." },
  { href: "/ai-studio", t: "AI agents", d: "24/7 AI receptionist, lead follow-up, reviews, and more." },
  { href: "/offices", t: "Private office & desks", d: "A private office and coworking desks by the day or month." },
  { href: "/services/marketing", t: "AI marketing", d: "Google profile, reviews, local SEO, social, and a website chatbot." },
];

export default async function LocationPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const loc = getLocation(city);
  if (!loc) notFound();

  return (
    <div>
      <section className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300/80">{loc.city}, Texas</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{loc.headline}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">{loc.intro}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/signup" className="btn-primary px-6 py-3 text-base">Get started</Link>
          <Link href="/contact" className="btn-outline px-6 py-3 text-base">Book a free consultation</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <h2 className="text-center text-2xl font-bold text-white">What {loc.city} businesses get</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.href} href={s.href} className="card group p-6 transition-all hover:border-violet-400/30">
              <h3 className="font-semibold text-white group-hover:text-violet-300">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.d}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="card border-violet-400/20 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Proudly serving {loc.city} &amp; the Gulf Coast</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            We support businesses across {loc.city} and {loc.nearby}. Local team, real Galveston address, and
            everything online — sign up and be running in minutes.
          </p>
          <Link href="/signup" className="btn-primary mt-6 px-6 py-3 text-base">Create your account</Link>
        </div>
      </section>
    </div>
  );
}
