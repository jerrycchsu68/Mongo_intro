"use client";

import { useState } from "react";
import { drawLottery, type LotteryResult } from "../app/actions";

const SLICES = 10; // 10 格，其中 1 格中獎 = 10%
const WIN_INDEX = 0;
const SLICE_DEG = 360 / SLICES;
const R = 140;

// 第 i 格的扇形路徑（從正上方開始順時針）
function slicePath(i: number) {
  const a0 = ((i - 0.5) * SLICE_DEG * Math.PI) / 180;
  const a1 = ((i + 0.5) * SLICE_DEG * Math.PI) / 180;
  const p = (a: number) => `${(R * Math.sin(a)).toFixed(2)} ${(-R * Math.cos(a)).toFixed(2)}`;
  return `M0 0 L${p(a0)} A${R} ${R} 0 0 1 ${p(a1)} Z`;
}

type Phase = "idle" | "loading" | "spinning" | "done";

export default function LotteryWheel() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<LotteryResult | null>(null);
  const [copied, setCopied] = useState(false);

  const spin = async () => {
    if (phase !== "idle") return;
    setPhase("loading");
    const res = await drawLottery();
    setResult(res);

    if (res.outcome === "error") {
      setPhase("idle");
      return;
    }
    // 決定要停在哪一格：中獎停在第 0 格，沒中隨機停在其他格
    const target = res.outcome === "win" ? WIN_INDEX : 1 + Math.floor(Math.random() * (SLICES - 1));
    const jitter = (Math.random() - 0.5) * SLICE_DEG * 0.6; // 不要每次都停在正中間

    // 已經抽過：不再轉動，直接把指針停在對應結果的格子上
    if (res.alreadyPlayed) {
      setRotation(360 - target * SLICE_DEG + jitter);
      setPhase("done");
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const turns = reduce ? 0 : 6;
    setRotation(turns * 360 + (360 - target * SLICE_DEG) + jitter);
    setPhase("spinning");
    if (reduce) setPhase("done");
  };

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 不支援剪貼簿時，使用者仍可手動選取
    }
  };

  const showResult = phase === "done" && result && result.outcome !== "error";

  return (
    <div className="flex flex-col items-center">
      {/* 轉盤 */}
      <div className="relative h-64 w-64 sm:h-72 sm:w-72">
        {/* 指針 */}
        <div aria-hidden className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1">
          <div className="h-0 w-0 border-x-[12px] border-t-[20px] border-x-transparent border-t-ink drop-shadow" />
        </div>

        <svg
          viewBox="-150 -150 300 300"
          className="h-full w-full drop-shadow-[0_20px_30px_rgba(178,54,29,0.25)]"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: phase === "spinning" ? "transform 4.5s cubic-bezier(0.15, 0.7, 0.1, 1)" : "none",
          }}
          onTransitionEnd={() => phase === "spinning" && setPhase("done")}
          role="img"
          aria-label="抽獎轉盤：10 格中有 1 格是 9 折優惠"
        >
          <defs>
            <radialGradient id="win-slice" cx="50%" cy="20%" r="80%">
              <stop offset="0%" stopColor="#ffd683" />
              <stop offset="55%" stopColor="#ee8a2d" />
              <stop offset="100%" stopColor="#b2361d" />
            </radialGradient>
          </defs>
          <circle r="146" fill="#1d2318" />
          {Array.from({ length: SLICES }).map((_, i) => {
            const win = i === WIN_INDEX;
            return (
              <g key={i}>
                <path d={slicePath(i)} fill={win ? "url(#win-slice)" : i % 2 ? "#f2ede3" : "#f6dfb9"} stroke="#1d2318" strokeOpacity="0.12" />
                <text
                  transform={`rotate(${i * SLICE_DEG}) translate(0 -96)`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-serif"
                  fontSize={win ? 22 : 11}
                  fontWeight={win ? 900 : 600}
                  fill={win ? "#fff" : "#6e6a5d"}
                >
                  {win ? "9 折" : "謝謝參加"}
                </text>
              </g>
            );
          })}
          {/* 中心 */}
          <circle r="30" fill="#f2ede3" stroke="#1d2318" strokeOpacity="0.15" />
          <circle r="22" fill="url(#win-slice)" />
          <circle r="22" fill="none" stroke="#fff" strokeOpacity="0.5" />
        </svg>
      </div>

      {/* 結果 / 按鈕 */}
      <div className="mt-8 w-full text-center" aria-live="polite">
        {!showResult && (
          <>
            <button
              type="button"
              onClick={spin}
              disabled={phase !== "idle"}
              className="w-full rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-paper transition hover:bg-mango disabled:cursor-wait disabled:opacity-80 sm:w-auto sm:min-w-56"
            >
              {phase === "idle" ? "開始抽獎" : "轉動中…"}
            </button>
            {result?.outcome === "error" && <p className="mt-3 text-sm text-mango">{result.message}</p>}
            <p className="mt-3 text-xs text-muted">中獎機率 10%・每人限抽一次</p>
          </>
        )}

        {showResult && result.outcome === "win" && (
          <div>
            <p className="font-serif text-2xl font-bold">
              {result.alreadyPlayed ? "你已經抽中過囉！" : "恭喜中獎！🎉"}
            </p>
            {/* 優惠券 */}
            <div className="relative mx-auto mt-5 max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-[#ffb35c] via-mango to-[#b2361d] p-[1px] shadow-[0_20px_40px_-15px_rgba(178,54,29,0.6)]">
              <div className="rounded-2xl bg-gradient-to-br from-mango to-[#c24a22] px-6 py-5 text-left text-white">
                <div className="flex items-baseline justify-between">
                  <span className="font-en text-sm italic text-white/80">Mango Coupon</span>
                  <span className="font-serif text-3xl font-black">9 折</span>
                </div>
                <div className="my-4 border-t border-dashed border-white/50" />
                <div className="flex items-center justify-between gap-3">
                  <code className="font-mono text-lg font-semibold tracking-wider">{result.code}</code>
                  <button
                    type="button"
                    onClick={() => copy(result.code)}
                    className="rounded-full bg-white/20 px-4 py-1.5 text-xs backdrop-blur transition hover:bg-white/35"
                  >
                    {copied ? "已複製 ✓" : "複製"}
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-6 text-muted">
              預購時在訂購信中附上這組優惠碼即可折抵。限 2027 產季芒果預購使用，每組限用一次。
            </p>
            <a
              href="#shop"
              data-modal-close
              className="mt-5 inline-block w-full rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-paper transition hover:bg-mango sm:w-auto"
            >
              馬上去預購
            </a>
          </div>
        )}

        {showResult && result.outcome === "lose" && (
          <div>
            <p className="font-serif text-2xl font-bold">{result.alreadyPlayed ? "你已經抽過囉" : "差一點點！"}</p>
            <p className="mt-2 text-sm leading-7 text-ink/75">
              這次沒有抽中優惠，不過留下 Email，開賣時我們會第一個通知你。
            </p>
            <a
              href="#notify"
              data-modal-close
              className="mt-5 inline-block w-full rounded-full border border-ink/25 px-8 py-3.5 text-sm font-medium transition hover:border-ink sm:w-auto"
            >
              開賣時通知我
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
