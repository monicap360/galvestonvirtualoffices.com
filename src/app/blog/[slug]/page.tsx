import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { POSTS, getPost } from "@/lib/blog";
import { dateLabel } from "@/lib/format";

const SITE_URL = "https://galvestonvirtualoffices.com";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.description, url: `${SITE_URL}/blog/${post.slug}` },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Galveston Virtual Offices" },
    publisher: { "@type": "Organization", name: "Galveston Virtual Offices" },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/blog" className="text-sm text-violet-300 hover:underline">← All articles</Link>
      <p className="mt-4 text-xs text-slate-500">{dateLabel(post.date)} · {post.readMins} min read</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{post.title}</h1>

      <div className="mt-8 space-y-5">
        {post.blocks.map((b, i) => {
          if ("h2" in b) return <h2 key={i} className="pt-2 text-xl font-bold text-white">{b.h2}</h2>;
          if ("ul" in b) return (
            <ul key={i} className="space-y-2 text-slate-300">
              {b.ul.map((li) => (
                <li key={li} className="flex gap-2"><span className="text-violet-300">✓</span>{li}</li>
              ))}
            </ul>
          );
          return <p key={i} className="text-slate-300">{b.p}</p>;
        })}
      </div>

      <div className="card mt-12 flex flex-col items-center gap-4 border-violet-400/20 p-8 text-center">
        <h2 className="text-xl font-bold text-white">Ready to set up your Galveston business?</h2>
        <p className="max-w-xl text-slate-300">Get your address, mailbox, and AI tools online in minutes — or book a free consultation.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/signup" className="btn-primary px-6 py-3 text-base">Get started</Link>
          <Link href="/contact" className="btn-outline px-6 py-3 text-base">Book a free consultation</Link>
        </div>
      </div>
    </article>
  );
}
