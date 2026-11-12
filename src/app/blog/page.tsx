import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Parallax from "../../components/Parallax";
import PostMeta from "../../components/PostMeta";
import { posts } from "../../lib/posts";

export const metadata: Metadata = {
  title: "芒果誌｜玉井夏芒",
  description: "芒果的挑選、保存，以及玉井果園一整年的故事。",
};

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <div id="top" className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-24 sm:px-8">
        {/* 刊頭 */}
        <div className="flex items-center justify-between border-b border-ink/15 py-4 font-en text-sm italic text-muted">
          <span>Journal</span>
          <span>{posts.length} Stories</span>
        </div>
        <header className="grid gap-6 py-12 md:py-16 lg:grid-cols-12 lg:items-end">
          <h1 className="font-serif text-[clamp(3rem,9vw,7rem)] font-black leading-none tracking-tight lg:col-span-7">
            芒果<span className="text-mango">誌</span>
          </h1>
          <p className="max-w-md text-[15px] leading-8 text-ink/75 lg:col-span-5">
            怎麼挑、怎麼放、怎麼種。從果園寫給每一位喜歡芒果的人。
          </p>
        </header>

        {/* 主打文章：手機上下排｜電腦左右排 */}
        <Link href={`/blog/${featured.slug}`} className="reveal group grid gap-6 border-t border-ink/20 pt-8 lg:grid-cols-12 lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] lg:col-span-7 md:rounded-[2rem]">
            <Parallax className="absolute inset-x-0 -inset-y-[10%]" strength={0.08}>
              <Image
                src={featured.cover}
                alt={featured.coverAlt}
                fill
                preload
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </Parallax>
          </div>
          <div className="flex flex-col justify-center lg:col-span-5">
            <PostMeta category={featured.category} date={featured.date} readMinutes={featured.readMinutes} />
            <h2 className="mt-4 font-serif text-3xl font-bold leading-snug transition group-hover:text-mango sm:text-4xl">
              {featured.title}
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-ink/75">{featured.excerpt}</p>
            <span className="mt-8 inline-flex w-fit items-center gap-3 border-b border-ink pb-1 text-sm font-medium">
              閱讀全文
              <span aria-hidden className="transition group-hover:translate-x-1">→</span>
            </span>
          </div>
        </Link>

        {/* 其他文章 */}
        <div className="mt-16 grid gap-12 border-t border-ink/20 pt-8 md:grid-cols-2 md:gap-8 lg:gap-12">
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="reveal group block">
              <div className="relative aspect-[3/2] overflow-hidden rounded-[1.5rem]">
                <Parallax className="absolute inset-x-0 -inset-y-[10%]" strength={0.08}>
                  <Image
                    src={p.cover}
                    alt={p.coverAlt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </Parallax>
              </div>
              <div className="mt-6">
                <PostMeta category={p.category} date={p.date} readMinutes={p.readMinutes} />
                <h2 className="mt-3 font-serif text-2xl font-bold leading-snug transition group-hover:text-mango">{p.title}</h2>
                <p className="mt-3 text-sm leading-7 text-ink/75">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
