import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MangoCatchGame from "../../components/MangoCatchGame";

export const metadata: Metadata = {
  title: "接芒果小遊戲｜玉井夏芒",
  description: "15 秒內用籃子接住芒果，看看你能拿幾分。單純娛樂，沒有獎品。",
};

export default function GamePage() {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-24 sm:px-8">
        <div className="flex items-center justify-between border-b border-ink/15 py-4 font-en text-sm italic text-muted">
          <span>Mini Game</span>
          <span>Just for fun</span>
        </div>

        <div className="grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:items-center lg:gap-12">
          <header className="lg:col-span-4">
            <h1 className="font-serif text-[clamp(2.75rem,7vw,5rem)] font-black leading-[1.05] tracking-tight">
              接<span className="text-mango">芒果</span>
            </h1>
            <p className="mt-5 max-w-sm text-[15px] leading-8 text-ink/75">
              夏天還沒到，先來果園暖暖身。15 秒內接住越多芒果越好，小心別接到爛掉的。
            </p>
            <dl className="mt-8 grid max-w-sm grid-cols-3 gap-4 border-t border-ink/15 pt-5 text-sm">
              <div>
                <dt className="font-en text-xs italic text-muted">Time</dt>
                <dd className="mt-1 font-serif text-lg font-bold">15 秒</dd>
              </div>
              <div>
                <dt className="font-en text-xs italic text-muted">Golden</dt>
                <dd className="mt-1 font-serif text-lg font-bold">+3 分</dd>
              </div>
              <div>
                <dt className="font-en text-xs italic text-muted">Rotten</dt>
                <dd className="mt-1 font-serif text-lg font-bold">−2 分</dd>
              </div>
            </dl>
            <p className="mt-6 text-xs text-muted">※ 單純娛樂，沒有獎品。</p>
          </header>

          <div className="mx-auto w-full max-w-md sm:max-w-none lg:col-span-8">
            <MangoCatchGame />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
