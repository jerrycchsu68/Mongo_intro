import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Parallax from "../../../components/Parallax";
import PostMeta from "../../../components/PostMeta";
import { posts, getPost, type Block } from "../../../lib/posts";

// build 時先產生所有文章頁
export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title}｜玉井夏芒`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.cover] },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug);

  return (
    <div id="top" className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* 封面 */}
        <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8 md:pt-10">
          <Link href="/blog" className="group inline-flex items-center gap-2 text-sm text-muted transition hover:text-ink">
            <span aria-hidden className="transition group-hover:-translate-x-1">←</span>
            芒果誌
          </Link>

          <div className="relative mt-6 aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:aspect-[16/10] md:rounded-[2rem] lg:aspect-[21/9]">
            <Parallax className="absolute inset-x-0 -inset-y-[15%]" strength={0.14}>
              <Image src={post.cover} alt={post.coverAlt} fill preload sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" />
            </Parallax>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10 lg:p-14">
              <PostMeta dark category={post.category} date={post.date} readMinutes={post.readMinutes} />
              <h1 className="mt-4 max-w-3xl font-serif text-[1.85rem] font-bold leading-tight sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
            </div>
          </div>
        </div>

        {/* 內文 */}
        <article className="mx-auto max-w-2xl px-5 py-14 sm:px-8 md:py-20">
          <p className="font-serif text-xl leading-9 text-ink/90 sm:text-[1.35rem] sm:leading-10">{post.excerpt}</p>
          <hr className="my-10 border-ink/15" />
          {post.body.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
        </article>

        {/* 文末導購 */}
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <div className="reveal flex flex-col gap-5 rounded-[1.5rem] bg-leaf p-8 text-paper sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-en text-sm italic text-paper/70">From the orchard</p>
              <p className="mt-1 font-serif text-2xl font-bold">2027 產季預購開放中</p>
            </div>
            <Link href="/#shop" className="shrink-0 rounded-full bg-paper px-6 py-3 text-center text-sm font-medium text-ink transition hover:bg-mango hover:text-white">
              看芒果禮盒
            </Link>
          </div>
        </div>

        {/* 延伸閱讀 */}
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="flex items-baseline justify-between border-t border-ink/20 pt-6">
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">延伸閱讀</h2>
            <Link href="/blog" className="text-sm text-muted transition hover:text-ink">
              所有文章 →
            </Link>
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-8">
            {others.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="reveal group grid grid-cols-[7rem_1fr] items-center gap-5 sm:grid-cols-[10rem_1fr]">
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image src={p.cover} alt={p.coverAlt} fill sizes="160px" className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div>
                  <p className="text-xs text-muted">{p.category}</p>
                  <h3 className="mt-2 font-serif text-lg font-bold leading-snug transition group-hover:text-mango sm:text-xl">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mb-4 mt-12 font-serif text-2xl font-bold sm:text-[1.7rem]">{block.text}</h2>;
    case "p":
      return <p className="mb-6 text-[16px] leading-[2] text-ink/85">{block.text}</p>;
    case "quote":
      return (
        <blockquote className="my-10 border-l-2 border-mango pl-6 font-serif text-xl leading-9 text-ink sm:text-2xl sm:leading-10">
          {block.text}
        </blockquote>
      );
    case "list":
      return (
        <dl className="my-10 divide-y divide-ink/10 rounded-2xl border border-ink/15 bg-white/40">
          {block.items.map((item) => (
            <div key={item.title} className="grid gap-1 px-6 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="font-serif font-bold">{item.title}</dt>
              <dd className="text-[15px] leading-7 text-ink/80">{item.text}</dd>
            </div>
          ))}
        </dl>
      );
  }
}
