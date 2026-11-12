import Link from "next/link";
import Parallax from "./Parallax";

// 本頁用到的照片與作者（CC BY-SA 授權需標註，完整清單見 public/images/CREDITS.md）
const photoCredits = [
  { what: "首頁、選購、品種照片", by: "stephan de MARANTHI、Daniel Dan、Tamanna Rumee、Becky Mattson", src: "Unsplash" },
  { what: "果園照片", by: "Kinyua Seaman", src: "Unsplash" },
  { what: "愛文芒果", by: "Evo101469", src: "Wikimedia Commons, Public domain" },
  { what: "鳳梨釋迦", by: "Agnieszka Kwiecień (Nova)", src: "Wikimedia Commons, CC BY-SA 3.0" },
  { what: "蓮霧", by: "Salil Kumar Mukherjee", src: "Wikimedia Commons, CC BY-SA 4.0" },
  { what: "芭樂", by: "Sarang", src: "Wikimedia Commons, Public domain" },
  { what: "木瓜", by: "Maksym Kozlenko", src: "Wikimedia Commons, CC BY-SA 4.0" },
];

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/#shop", label: "愛文芒果禮盒" },
      { href: "/#shop", label: "金煌芒果箱" },
      { href: "/#winter", label: "冬季鮮果" },
      { href: "/#notify", label: "開賣通知" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/#varieties", label: "芒果品種" },
      { href: "/#orchard", label: "我們的果園" },
      { href: "/blog", label: "芒果誌" },
      { href: "/game", label: "接芒果小遊戲" },
      { href: "/#faq", label: "常見問題" },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="scroll-mt-16 overflow-hidden bg-ink text-paper">
      {/* 手機底部有固定預購列，多留空間避免擋到內容 */}
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8 md:pb-0 md:pt-20">
        {/* 手機：聯絡在上、連結兩欄｜平板：聯絡在上、連結三欄｜電腦：12 欄並排 */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-b border-paper/15 pb-14 sm:grid-cols-3 md:pb-16 lg:grid-cols-12 lg:gap-12">
          <div className="col-span-2 sm:col-span-3 lg:col-span-5">
            <p className="font-en text-lg italic text-paper/60">Contact</p>
            <p className="mt-4 font-serif text-[1.75rem] font-bold leading-snug sm:text-4xl">
              <span className="whitespace-nowrap">企業送禮、大量訂購，</span>
              <br />
              <span className="whitespace-nowrap">歡迎直接聯絡果園。</span>
            </p>
            {/* 聯絡資訊為示意資料 */}
            <a
              href="mailto:hello@example.com"
              className="mt-8 inline-flex items-center gap-3 border-b border-paper/40 pb-1 text-lg transition hover:border-mango hover:text-mango"
            >
              hello@example.com
              <span aria-hidden>→</span>
            </a>
            <p className="mt-4 text-sm text-paper/60">電話 06-000-0000（週一至週五 09:00 – 18:00）</p>
          </div>

          {columns.map((c) => (
            <div key={c.title} className="lg:col-span-2">
              <h3 className="font-en text-sm italic tracking-wide text-paper/50">{c.title}</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-paper/80 transition hover:text-mango">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 sm:col-span-1 lg:col-span-3">
            <h3 className="font-en text-sm italic tracking-wide text-paper/50">Orchard</h3>
            <ul className="mt-5 space-y-3 text-sm text-paper/80">
              <li>台南市玉井區</li>
              <li>產季 5 – 8 月，預購全年開放</li>
            </ul>
          </div>
        </div>

        {/* 大字落款：捲到頁尾時橫向滑入 */}
        <Parallax axis="x" strength={0.15}>
          <p
            aria-hidden
            className="select-none whitespace-nowrap pt-8 font-serif text-[20vw] font-black leading-[0.85] tracking-[0.02em] text-paper/[0.07] md:pt-10 xl:text-[15rem]"
          >
            玉井夏芒
          </p>
        </Parallax>

        <div className="border-t border-paper/15 py-6 text-xs text-paper/50">
          <details className="group">
            <summary className="cursor-pointer list-none transition hover:text-paper [&::-webkit-details-marker]:hidden">
              圖片來源 <span className="inline-block transition group-open:rotate-180">↓</span>
            </summary>
            <ul className="mt-3 space-y-1.5">
              {photoCredits.map((c) => (
                <li key={c.what}>
                  {c.what}：{c.by}（{c.src}）
                </li>
              ))}
            </ul>
          </details>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 玉井夏芒 Yujing Mango Orchard</p>
            <a href="#top" className="transition hover:text-paper">
              回到頂部 ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
