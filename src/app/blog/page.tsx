import Link from "next/link";
import { POSTS } from "@/lib/blog";
import { dateLabel } from "@/lib/format";

export const metadata = {
  title: "Blog — Virtual Offices, AI & Business Tips for Galveston & Houston",
  description:
    "Guides on virtual offices, virtual mailboxes, AI agents, and running a business on the Texas Gulf Coast — for Galveston and Houston entrepreneurs.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300/80">Insights</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          The Galveston &amp; Houston business blog
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
          Practical guides on virtual offices, mailboxes, AI agents, and running a business on the Gulf Coast.
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="card group flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:border-violet-400/30"
          >
            <p className="text-xs text-slate-500">{dateLabel(p.date)} · {p.readMins} min read</p>
            <h2 className="mt-2 text-xl font-semibold text-white group-hover:text-violet-300">{p.title}</h2>
            <p className="mt-2 flex-1 text-sm text-slate-400">{p.description}</p>
            <span className="mt-4 text-sm font-semibold text-violet-300">Read more →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
