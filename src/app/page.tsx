import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Parallax from "../components/Parallax";
import EmailSignup from "../components/EmailSignup";
import Modal from "../components/Modal";
import LotteryWheel from "../components/LotteryWheel";
import { WelcomeProvider, WelcomeGreeting } from "../components/Welcome";

const ORDER_EMAIL = "hello@example.com"; // 示意信箱，正式上線請替換

const orderLink = (item: string) =>
  `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(`預購：${item}`)}`;

const varieties = [
  {
    name: "愛文芒果促銷!",
    en: "Irwin",
    season: "6 – 7 月",
    img: "/images/mango.jpg",
    // 原圖右下角有日期浮水印，靠左裁切避開
    pos: "object-left",
    notes: ["果皮紅潤", "香氣濃郁", "果肉細緻無纖維"],
    desc: "玉井最具代表性的品種，也是我們果園的主力。熟成時從青綠轉為蘋果般的紅，切開香氣滿屋。",
  },
  {
    name: "金煌芒果",
    en: "Jin Hwang",
    season: "7 – 8 月",
    img: "/images/mango-unsplash-5.jpg",
    pos: "object-center",
    notes: ["果型碩大", "果肉厚實", "甜度高"],
    desc: "一顆可以到一斤以上，籽薄肉厚，適合全家一起分著吃，也很適合做成芒果冰。",
  },
  {
    name: "土芒果",
    en: "Native Mango",
    season: "5 – 6 月",
    img: "/images/mango-unsplash-4.jpg",
    pos: "object-center",
    notes: ["小巧", "香氣最強", "酸甜帶勁"],
    desc: "台灣最早的芒果，個頭小但香氣十足。產季最早，是夏天開始的訊號。",
  },
];

const steps = [
  { no: "i.", title: "一果一袋", text: "幼果期就逐顆套袋，減少日曬斑點與蟲害，也不用多噴藥。" },
  { no: "ii.", title: "樹上自然熟", text: "不採青、不催熟，等果實在樹上轉色才採收，甜度與香氣才完整。" },
  { no: "iii.", title: "清晨採收", text: "趁天亮前氣溫低時採收，當天選果、分級、裝箱。" },
  { no: "iv.", title: "低溫宅配", text: "產地直接出貨，全程冷藏配送，1 – 2 天送到家。" },
];

const products = [
  {
    name: "愛文芒果禮盒",
    spec: "5 斤裝 · 約 8 – 10 顆",
    price: "1,280",
    tag: "人氣",
  },
  {
    name: "愛文芒果家庭箱",
    spec: "10 斤裝 · 約 16 – 20 顆",
    price: "2,380",
    tag: null,
  },
  {
    name: "金煌芒果箱",
    spec: "10 斤裝 · 約 8 – 10 顆",
    price: "1,880",
    tag: null,
  },
  {
    name: "芒果三重奏",
    spec: "土芒果、愛文、金煌各一盒 · 依產季分三次出貨",
    price: "3,480",
    tag: "限量",
  },
];

const winterFruits = [
  { name: "鳳梨釋迦", season: "11 – 4 月", img: "/images/atemoya.jpg" },
  { name: "黑珍珠蓮霧", season: "12 – 4 月", img: "/images/wax-apple.jpg" },
  { name: "珍珠芭樂", season: "全年", img: "/images/guava.jpg" },
  { name: "台農木瓜", season: "全年", img: "/images/papaya.jpg" },
];

const faqs = [
  {
    q: "現在下訂，什麼時候會出貨？",
    a: "芒果產季在 5 – 8 月。現在預購會依下單順序排定，土芒果約 5 月、愛文約 6 月、金煌約 7 月開始出貨，出貨前會先寄信通知。",
  },
  {
    q: "收到芒果後該怎麼保存？",
    a: "還偏硬、帶點青色的芒果請放室溫通風處 2 – 3 天，等果皮轉色、聞到香氣、輕壓微軟再冰。已經熟的芒果放冷藏，3 – 5 天內吃完風味最好。",
  },
  {
    q: "收到時有壓傷或壞果怎麼辦？",
    a: "請在收到 24 小時內拍下外箱與果實照片寄給我們，確認後會補寄或退款。",
  },
  {
    q: "可以寄送到外島或海外嗎？",
    a: "目前提供台灣本島冷藏宅配。外島與海外配送請來信詢問。",
  },
];

function SectionHead({ no, title, note, dark = false }: { no: string; title: string; note?: string; dark?: boolean }) {
  return (
    // 手機：上下堆疊｜平板：編號在左、標題與說明在右｜電腦：12 欄三段式
    <div
      className={`reveal relative isolate grid gap-3 border-t pt-6 md:grid-cols-[7rem_1fr] md:gap-x-6 lg:grid-cols-12 ${dark ? "border-paper/25" : "border-ink/20"}`}
    >
      {/* 背景大編號，捲動時比標題移動得快，做出前後層次 */}
      <Parallax className="pointer-events-none absolute -top-6 right-0 -z-10 select-none md:-top-12" strength={-0.6}>
        <span
          aria-hidden
          className={`block font-en text-[7rem] italic leading-none md:text-[11rem] lg:text-[14rem] ${dark ? "text-paper/[0.06]" : "text-ink/[0.05]"}`}
        >
          {no}
        </span>
      </Parallax>
      <p className={`font-en text-xl italic md:pt-2 md:text-2xl lg:col-span-2 ${dark ? "text-[#f2a46f]" : "text-mango"}`}>No. {no}</p>
      <h2 className="font-serif text-[2rem] font-bold leading-tight tracking-wide sm:text-4xl lg:col-span-6 lg:text-5xl">{title}</h2>
      {note && (
        <p className={`max-w-xl text-sm leading-7 md:col-start-2 lg:col-span-4 lg:col-start-auto lg:pt-2 ${dark ? "text-paper/70" : "text-muted"}`}>{note}</p>
      )}
    </div>
  );
}

// 出貨時程彈出視窗的內容
const SHIP_MONTHS = [5, 6, 7, 8];
const shipping = [
  { name: "土芒果", months: [5, 6], note: "產季最早，量少先搶" },
  { name: "愛文芒果", months: [6, 7], note: "主力品種，依下單順序出貨" },
  { name: "金煌芒果", months: [7, 8], note: "產季最晚，大顆厚肉" },
];

function ShippingSchedule() {
  return (
    <div>
      {/* 月份時間軸 */}
      <div className="grid grid-cols-[5.5rem_repeat(4,1fr)] items-center gap-y-4 text-sm sm:grid-cols-[7rem_repeat(4,1fr)]">
        <span />
        {SHIP_MONTHS.map((m) => (
          <span key={m} className="text-center font-en text-base italic text-muted">
            {m} 月
          </span>
        ))}
        {shipping.map((s) => (
          <div key={s.name} className="contents">
            <span className="font-serif font-bold">{s.name}</span>
            {SHIP_MONTHS.map((m) => {
              const on = s.months.includes(m);
              const first = on && !s.months.includes(m - 1);
              const last = on && !s.months.includes(m + 1);
              return (
                <span key={m} className="block h-3 px-0">
                  {on && (
                    <span
                      className={`block h-3 bg-gradient-to-b from-[#ffd683] via-[#ee8a2d] to-[#b2361d] ${first ? "ml-1 rounded-l-full" : ""} ${last ? "mr-1 rounded-r-full" : ""}`}
                    />
                  )}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      <ul className="mt-8 space-y-3 border-t border-ink/15 pt-6 text-sm leading-7 text-ink/80">
        {shipping.map((s) => (
          <li key={s.name} className="flex gap-3">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mango" />
            <span>
              <strong className="font-medium text-ink">{s.name}</strong>：{s.note}
            </span>
          </li>
        ))}
        <li className="flex gap-3">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mango" />
          <span>實際出貨日依當年天候調整，出貨前三天會寄信通知。</span>
        </li>
      </ul>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href="#shop"
          data-modal-close
          className="flex-1 rounded-full bg-ink px-6 py-3.5 text-center text-sm font-medium text-paper transition hover:bg-mango"
        >
          前往預購
        </a>
        <a
          href="#notify"
          data-modal-close
          className="flex-1 rounded-full border border-ink/25 px-6 py-3.5 text-center text-sm font-medium transition hover:border-ink"
        >
          開賣時通知我
        </a>
      </div>
    </div>
  );
}

const glassCard =
  "overflow-hidden rounded-2xl border border-white/50 bg-white/20 shadow-[0_20px_50px_-20px_rgba(29,35,24,0.45)] backdrop-blur-2xl";

function GlassShine() {
  return (
    <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
  );
}

export default function Home() {
  return (
    // 一進首頁就請訪客輸入稱呼（每次進來都會問，暫不記住）
    <WelcomeProvider>
    <div id="top" className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* ── 首頁主視覺 ── */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex items-center justify-between border-b border-ink/15 py-4 font-en text-sm italic text-muted">
            <span>Est. Yujing, Tainan</span>
            <span className="hidden sm:inline">2027 產季預購中</span>
            <span>23° 07′ N</span>
          </div>

          <div className="grid items-center gap-12 py-12 md:grid-cols-12 md:py-16">
            <div className="md:col-span-6">
              <Parallax strength={0.12} media="(min-width: 768px)">
              {/* 訪客有輸入稱呼才會出現 */}
              <WelcomeGreeting className="mb-5" />
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-1.5 text-xs tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-mango" />
                2027 夏季預購開放中 · 6 月起依序出貨
              </p>
              <h1 className="font-serif text-[clamp(3.25rem,8.5vw,7rem)] font-black leading-[1.02] tracking-tight">
                全日照的芒果，
                <br />
                等<span className="text-mango">一整年</span>。
              </h1>
              <p className="mt-8 max-w-md text-[15px] leading-8 text-ink/80">
                台南玉井的果園直送。不採青、不催熟，讓每一顆芒果在樹上曬足太陽才摘下，隔天就送到你家。
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <a
                  href="#shop"
                  className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition hover:bg-mango"
                >
                  選購芒果禮盒
                </a>
                <Modal
                  eyebrow="Shipping Schedule"
                  title="2027 出貨時程"
                  trigger={
                    <>
                      <svg aria-hidden viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 transition group-hover:text-mango">
                        <rect x="3" y="4.5" width="14" height="12" rx="2" />
                        <path d="M3 8.5h14M7 2.5v4M13 2.5v4" strokeLinecap="round" />
                      </svg>
                      出貨時程
                    </>
                  }
                  triggerClassName="group inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white/30 px-5 py-3 text-sm font-medium backdrop-blur-md transition hover:border-ink"
                >
                  <ShippingSchedule />
                </Modal>
                <a href="#orchard" className="group inline-flex items-center gap-3 border-b border-ink pb-1 text-sm font-medium">
                  認識我們的果園
                  <span aria-hidden className="transition group-hover:translate-x-1">→</span>
                </a>
              </div>
              </Parallax>
            </div>

            <div className="relative md:col-span-6">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[5/6]">
                {/* 照片比框多出上下 12%，捲動時在框裡慢慢移動 */}
                <Parallax className="absolute inset-x-0 -inset-y-[12%]" strength={0.1}>
                  <Image
                    src="/images/mango-unsplash-2.jpg"
                    alt="一顆紅黃漸層的愛文芒果"
                    fill
                    preload
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </Parallax>
              </div>
              {/* 玻璃卡片往反方向飄，像浮在照片前面 */}
              <Parallax className="absolute bottom-5 left-5 right-5 sm:right-auto sm:w-72" strength={-0.1}>
                <div className={`${glassCard} relative p-5 text-white`}>
                  <GlassShine />
                  <p className="font-en text-sm italic text-white/80">Signature Box</p>
                  <p className="mt-1 font-serif text-2xl font-bold">愛文芒果禮盒</p>
                  <div className="mt-4 flex items-end justify-between border-t border-white/30 pt-3">
                    <span className="text-xs text-white/80">5 斤裝 · 預購價</span>
                    <span className="font-en text-2xl font-semibold">NT$ 1,280</span>
                  </div>
                </div>
              </Parallax>
            </div>
          </div>
        </section>

        {/* ── 跑馬燈 ── */}
        <div className="overflow-hidden border-y border-ink/15 py-5" aria-hidden>
          <div className="marquee flex w-max">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {["台南玉井直送", "Tree-ripened", "不採青 · 不催熟", "Hand-picked at dawn", "產地低溫宅配", "Since the orchard"].map((t) => (
                  <span key={t} className="flex items-center gap-10 pr-10">
                    <span className={t.match(/[A-Za-z]/) ? "font-en text-2xl italic text-muted" : "font-serif text-2xl font-bold"}>
                      {t}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-mango" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── 01 品種 ── */}
        <section id="varieties" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-24 sm:px-8">
          <SectionHead no="01" title="三種芒果，三種夏天" note="從五月的土芒果、六月的愛文，到七月的金煌，整個夏天都有芒果可以吃。" />
          {/* 手機：左右滑動卡片｜平板以上：三欄等大、上緣對齊 */}
          <p className="mt-8 font-en text-sm italic text-muted md:hidden">Swipe →</p>
          <div className="no-scrollbar -mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-0 md:mt-14 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 lg:gap-8">
            {varieties.map((v) => (
              <article key={v.name} className="group w-[78%] shrink-0 snap-start sm:w-[55%] md:w-auto">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                  <Parallax className="absolute inset-x-0 -inset-y-[10%]" strength={0.08}>
                    <Image
                      src={v.img}
                      alt={v.name}
                      fill
                      sizes="(min-width: 768px) 33vw, 80vw"
                      className={`object-cover ${v.pos} transition duration-700 group-hover:scale-105`}
                    />
                  </Parallax>
                  <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-ink/45 px-3 py-1 text-xs text-white backdrop-blur-md">
                    {v.season}
                  </span>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-3 border-b border-ink/15 pb-3 lg:mt-6">
                  <h3 className="font-serif text-xl font-bold lg:text-2xl">{v.name}</h3>
                  <span className="font-en text-lg italic text-muted">{v.en}</span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {v.notes.map((n) => (
                    <li key={n} className="rounded-full border border-ink/15 px-3 py-1 text-xs">
                      {n}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm leading-7 text-ink/75">{v.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── 02 果園 ── */}
        <section id="orchard" className="scroll-mt-16 bg-leaf text-paper">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <SectionHead dark no="02" title="從樹上，到你家" note="玉井位在台南山區，日夜溫差大、日照充足，是台灣愛文芒果的故鄉。" />

            <div className="relative mt-10 aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:aspect-[4/3] md:mt-14 md:rounded-[2rem] lg:aspect-[16/9]">
              <Parallax className="absolute inset-x-0 -inset-y-[15%]" strength={0.14}>
                <Image
                  src="/images/mango-unsplash-3.jpg"
                  alt="果園裡掛在枝頭的芒果"
                  fill
                  sizes="(min-width: 1280px) 1216px, 100vw"
                  className="object-cover"
                />
              </Parallax>
              <Parallax
                className="absolute bottom-12 left-5 right-5 max-w-md sm:bottom-16 sm:left-8 sm:right-auto"
                strength={-0.05}
              >
                <blockquote className={`${glassCard} relative p-6`}>
                  <GlassShine />
                  <p className="font-serif text-xl leading-relaxed text-white">
                    「芒果要在樹上熟，才會有真正的香氣。我們寧願等，也不提早摘。」
                  </p>
                  <footer className="mt-3 font-en text-sm italic text-white/75">— 果園主人</footer>
                </blockquote>
              </Parallax>
            </div>

            <ol className="mt-12 grid gap-8 sm:grid-cols-2 sm:gap-10 md:mt-16 lg:grid-cols-4">
              {steps.map((s) => (
                <li key={s.title} className="reveal border-t border-paper/25 pt-5">
                  <p className="font-en text-2xl italic text-[#f2a46f]">{s.no}</p>
                  <h3 className="mt-3 font-serif text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-paper/75">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── 03 選購 ── */}
        <section id="shop" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-24 sm:px-8">
          <SectionHead no="03" title="2027 產季預購" note="價格含運費（台灣本島冷藏宅配）。現在預購，產季開始依下單順序出貨。" />

          {/* 手機／平板：上圖下清單｜電腦：左圖右清單 */}
          <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-12">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] md:aspect-[21/9] md:rounded-[2rem] lg:col-span-5 lg:aspect-auto lg:min-h-[560px]">
              <Parallax className="absolute inset-x-0 -inset-y-[12%]" strength={0.1}>
                <Image
                  src="/images/mango-unsplash-1.jpg"
                  alt="一整箱成熟的芒果"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </Parallax>
              <div className={`${glassCard} absolute left-5 top-5 px-4 py-3 text-white`}>
                <GlassShine />
                <p className="font-en text-xs italic text-white/80">Pre-order closes</p>
                <p className="font-serif text-lg font-bold">2027 年 4 月 30 日</p>
              </div>
            </div>

            <ul className="lg:col-span-7">
              {products.map((p) => (
                <li
                  key={p.name}
                  className="reveal group flex flex-col gap-4 border-b border-ink/15 py-6 first:pt-0 sm:flex-row sm:items-center sm:justify-between sm:py-7"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-xl font-bold sm:text-2xl">{p.name}</h3>
                      {p.tag && (
                        <span className="rounded-full bg-mango px-2.5 py-0.5 text-xs text-white">{p.tag}</span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm text-muted">{p.spec}</p>
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-6 sm:justify-end">
                    <p className="font-en text-2xl font-semibold sm:text-3xl">
                      <span className="mr-1 text-base text-muted">NT$</span>
                      {p.price}
                    </p>
                    <a
                      href={orderLink(p.name)}
                      className="rounded-full border border-ink px-5 py-2.5 text-sm transition group-hover:bg-ink group-hover:text-paper"
                    >
                      預購
                    </a>
                  </div>
                </li>
              ))}
              <li className="pt-6 text-xs leading-6 text-muted">
                ※ 芒果為農產品，每顆大小與外觀略有差異；遇天候影響產量時，將依下單順序出貨或全額退款。
              </li>
            </ul>
          </div>
        </section>

        {/* ── 04 冬季鮮果 ── */}
        <section id="winter" className="mx-auto max-w-7xl scroll-mt-16 px-5 pb-24 sm:px-8">
          <SectionHead
            no="04"
            title="芒果休息的季節"
            note="芒果樹在冬天休養生息。這段時間，我們也替你挑選鄰近果園的當季好果。"
          />
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:mt-14 md:grid-cols-4 md:gap-5">
            {winterFruits.map((f) => (
              <a key={f.name} href={orderLink(f.name)} className="reveal group block">
                <div className="relative aspect-square overflow-hidden rounded-[1.25rem]">
                  <Parallax className="absolute inset-x-0 -inset-y-[10%]" strength={0.08}>
                    <Image
                      src={f.img}
                      alt={f.name}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </Parallax>
                </div>
                <div className="mt-3 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-serif text-base font-bold sm:text-lg">{f.name}</h3>
                  <span className="text-xs text-muted">{f.season}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── 過場：冬季 → 開賣通知（兩行大字反向橫移＋浮動芒果） ── */}
        <div aria-hidden className="relative overflow-hidden py-10 sm:py-14 md:py-20">
          <Parallax axis="x" strength={-0.25}>
            <p className="-ml-[30vw] flex w-max whitespace-nowrap font-serif text-[16vw] font-black leading-none text-ink/[0.08] md:text-[11vw]">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="pr-[4vw]">芒果休息中・等待下一個夏天・</span>
              ))}
            </p>
          </Parallax>
          <Parallax axis="x" strength={0.25}>
            <p className="-ml-[60vw] mt-2 flex w-max whitespace-nowrap font-en text-[11vw] italic leading-none text-mango/25 md:text-[7vw]">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="pr-[4vw]">Resting season — summer is coming —</span>
              ))}
            </p>
          </Parallax>

          {/* 中間浮起的芒果，比頁面捲得更快 */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Parallax strength={-0.45}>
              <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white/70 shadow-[0_30px_60px_-20px_rgba(178,54,29,0.55)] sm:h-48 sm:w-48 md:h-60 md:w-60">
                <Image src="/images/mango-unsplash-2.jpg" alt="" fill sizes="240px" className="scale-150 object-cover object-[35%_50%]" />
                {/* 玻璃高光 */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.55)_0,rgba(255,255,255,0)_35%)]" />
              </div>
            </Parallax>
          </div>
        </div>

        {/* ── 開賣通知 ── */}
        <section id="notify" className="mx-auto max-w-7xl scroll-mt-20 px-5 pb-24 sm:px-8">
          <div className="reveal relative isolate overflow-hidden rounded-[1.5rem] text-white md:rounded-[2rem]">
            {/* 背景：芒果照片＋芒果色覆蓋，讓玻璃輸入框有東西可以透 */}
            <Parallax className="absolute inset-x-0 -inset-y-[20%] -z-20" strength={0.12}>
              <Image src="/images/mango-unsplash-1.jpg" alt="" fill sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" />
            </Parallax>
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-mango/95 via-mango/85 to-[#b8431c]/80" />

            <div className="grid gap-8 px-6 py-12 sm:px-10 md:py-16 lg:grid-cols-12 lg:items-end lg:gap-12 lg:px-14 lg:py-20">
              {/* 電腦版：標題較慢、表單較快，和背景照片形成三層速度 */}
              <Parallax className="lg:col-span-5" strength={0.1} media="(min-width: 1024px)">
                <p className="font-en text-lg italic text-white/80">Season Alert</p>
                <h2 className="mt-3 font-serif text-[2rem] font-bold leading-tight sm:text-4xl lg:text-5xl">
                  芒果熟了，
                  <br />
                  第一個通知你。
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-8 text-white/90">
                  留下 Email，每個品種開始採收前，我們會先寄信給你，搶在開賣前預留最好的那一批。
                </p>
              </Parallax>
              <Parallax className="lg:col-span-7" strength={-0.12} media="(min-width: 1024px)">
                {/* 之後要加選單：<EmailSignup options={VARIETY_OPTIONS} /> */}
                <EmailSignup />
              </Parallax>
            </div>
          </div>
        </section>

        {/* ── 05 常見問題 ── */}
        <section id="faq" className="mx-auto max-w-7xl scroll-mt-16 px-5 pb-28 sm:px-8">
          <SectionHead no="05" title="常見問題" />
          <div className="mt-8 md:ml-[8.5rem] lg:ml-[16.666%]">
            {faqs.map((f) => (
              <details key={f.q} className="reveal group border-b border-ink/15">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 sm:py-6 [&::-webkit-details-marker]:hidden">
                  <span className="font-serif text-lg font-bold sm:text-xl">{f.q}</span>
                  <span
                    aria-hidden
                    className="relative h-4 w-4 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-px before:w-4 before:bg-ink after:absolute after:left-1/2 after:top-0 after:h-4 after:w-px after:bg-ink after:transition group-open:after:rotate-90 group-open:after:opacity-0"
                  />
                </summary>
                <p className="max-w-2xl pb-6 text-[15px] leading-8 text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* 右下角浮動抽獎按鈕（手機版往上移，避開底部預購列） */}
      <Modal
        eyebrow="Lucky Draw"
        title="轉轉看，抽芒果 9 折券"
        trigger={
          <>
            <svg aria-hidden viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
              <rect x="3" y="8" width="14" height="9" rx="1.5" />
              <path d="M2 5.5h16V8H2zM10 5.5V17M10 5.5C8.5 2.5 5.5 3 6.2 4.8 6.6 5.6 10 5.5 10 5.5zm0 0c1.5-3 4.5-2.5 3.8-.7-.4.8-3.8.7-3.8.7z" strokeLinejoin="round" />
            </svg>
            <span>抽 9 折券</span>
          </>
        }
        triggerClassName="lottery-fab fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full border border-white/50 bg-gradient-to-br from-[#f7a04b] via-mango to-[#b2361d] py-3 pl-4 pr-5 text-sm font-medium text-white shadow-[0_15px_35px_-10px_rgba(178,54,29,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-10px_rgba(178,54,29,0.8)] md:bottom-8 md:right-8"
      >
        <LotteryWheel />
      </Modal>

      {/* 手機版底部固定預購列 */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/40 bg-paper/75 px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="leading-tight">
            <p className="text-xs text-muted">愛文芒果禮盒 · 預購價</p>
            <p className="font-en text-xl font-semibold">NT$ 1,280 起</p>
          </div>
          <a href="#shop" className="rounded-full bg-ink px-6 py-3 text-sm text-paper active:bg-mango">
            立即預購
          </a>
        </div>
      </div>
    </div>
    </WelcomeProvider>
  );
}
