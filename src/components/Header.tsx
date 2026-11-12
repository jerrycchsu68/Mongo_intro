import Link from "next/link";

// 用 "/#..." 讓在 /blog 等其他頁面點選時，也能跳回首頁對應區塊
const links = [
  { href: "/#varieties", no: "01", label: "品種" },
  { href: "/#orchard", no: "02", label: "果園" },
  { href: "/#shop", no: "03", label: "選購" },
  { href: "/#faq", no: "04", label: "常見問題" },
  { href: "/blog", no: "05", label: "芒果誌" },
  { href: "/game", no: "06", label: "小遊戲" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/70 backdrop-blur-xl">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-serif text-xl font-bold tracking-[0.15em]">玉井夏芒</span>
          {/* 平板導覽列較擠，英文副標只在手機橫向與電腦顯示 */}
          <span className="hidden font-en text-sm italic text-muted sm:inline md:hidden xl:inline">Yujing Mango Orchard</span>
        </Link>

        {/* 桌機版選單 */}
        <nav className="hidden items-center gap-5 text-sm md:flex lg:gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="group flex items-baseline gap-1.5">
              <span className="font-en text-xs italic text-muted transition group-hover:text-mango">{l.no}</span>
              <span className="relative whitespace-nowrap">
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
          ))}
          <Link href="/#shop" className="whitespace-nowrap rounded-full bg-ink px-5 py-2 text-paper transition hover:bg-mango">
            立即預購
          </Link>
        </nav>

        {/* 手機版選單：用 details 做開合，不需要 JavaScript */}
        <details className="group md:hidden">
          <summary
            aria-label="開啟選單"
            className="flex cursor-pointer list-none items-center gap-2 text-sm [&::-webkit-details-marker]:hidden"
          >
            <span className="group-open:hidden">選單</span>
            <span className="hidden group-open:inline">關閉</span>
            <span className="relative block h-2.5 w-5">
              <span className="absolute left-0 top-0 h-px w-5 bg-ink transition group-open:top-1.5 group-open:rotate-45" />
              <span className="absolute left-0 top-2.5 h-px w-5 bg-ink transition group-open:top-1.5 group-open:-rotate-45" />
            </span>
          </summary>
          <nav className="absolute inset-x-0 top-full border-b border-ink/10 bg-paper/90 px-5 pb-6 pt-2 backdrop-blur-xl">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="flex items-baseline gap-4 border-b border-ink/10 py-4">
                <span className="font-en text-lg italic text-mango">{l.no}</span>
                <span className="font-serif text-2xl font-bold">{l.label}</span>
              </Link>
            ))}
            <Link href="/#shop" className="mt-6 block rounded-full bg-ink py-3 text-center text-paper">
              立即預購
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
