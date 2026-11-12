"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* ───────────── 遊戲設定 ───────────── */
const DURATION = 15; // 秒
const BEST_KEY = "yujing-mango:catch-best";

type Kind = "normal" | "golden" | "rotten";
type Item = { x: number; y: number; r: number; vy: number; rot: number; vr: number; kind: Kind };
type Pop = { x: number; y: number; text: string; color: string; life: number };
type Phase = "ready" | "countdown" | "playing" | "over";
type Counts = Record<Kind, number>;

const POINTS: Record<Kind, number> = { normal: 1, golden: 3, rotten: -2 };
// 亮部、主色、暗部
const COLORS: Record<Kind, [string, string, string]> = {
  normal: ["#ffe08a", "#f39a3b", "#c2411f"],
  golden: ["#fffbe0", "#ffd23f", "#c98a00"],
  rotten: ["#b5aa7a", "#6f5f36", "#3b2f1a"],
};

function pickKind(): Kind {
  const n = Math.random();
  if (n < 0.08) return "golden"; // 8%
  if (n < 0.24) return "rotten"; // 16%
  return "normal";
}

function rating(score: number) {
  if (score >= 35) return "芒果之神";
  if (score >= 25) return "果園達人";
  if (score >= 15) return "採果好手";
  if (score >= 5) return "芒果學徒";
  return "芒果新手";
}

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

/* ───────────── 畫圖 ───────────── */
function drawMango(ctx: CanvasRenderingContext2D, it: Item) {
  const { x, y, r, rot, kind } = it;
  const [light, base, dark] = COLORS[kind];
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  if (kind === "golden") {
    ctx.shadowColor = "rgba(255, 196, 30, 0.9)";
    ctx.shadowBlur = r * 1.2;
  }
  const g = ctx.createRadialGradient(-r * 0.35, -r * 0.45, r * 0.1, 0, 0, r * 1.1);
  g.addColorStop(0, light);
  g.addColorStop(0.55, base);
  g.addColorStop(1, dark);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.82, r, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  if (kind === "rotten") {
    ctx.fillStyle = "rgba(30, 22, 10, 0.55)";
    for (const [sx, sy, sr] of [
      [-0.3, 0.1, 0.18],
      [0.25, -0.2, 0.13],
      [0.1, 0.45, 0.15],
    ]) {
      ctx.beginPath();
      ctx.arc(sx * r, sy * r, sr * r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 亮面高光
  ctx.fillStyle = kind === "rotten" ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.ellipse(-r * 0.3, -r * 0.45, r * 0.16, r * 0.28, -0.5, 0, Math.PI * 2);
  ctx.fill();

  // 蒂頭與葉子
  ctx.fillStyle = "#5b4422";
  ctx.fillRect(-r * 0.06, -r * 1.1, r * 0.12, r * 0.24);
  ctx.fillStyle = kind === "rotten" ? "#6b6a3a" : "#3f7a3a";
  ctx.beginPath();
  ctx.ellipse(r * 0.3, -r * 1.02, r * 0.34, r * 0.13, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBasket(ctx: CanvasRenderingContext2D, cx: number, top: number, bw: number, bh: number) {
  const bottomW = bw * 0.74;
  ctx.save();

  // 陰影
  ctx.fillStyle = "rgba(29, 35, 24, 0.15)";
  ctx.beginPath();
  ctx.ellipse(cx, top + bh + 6, bw * 0.42, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 籃身
  ctx.beginPath();
  ctx.moveTo(cx - bw / 2, top);
  ctx.lineTo(cx + bw / 2, top);
  ctx.lineTo(cx + bottomW / 2, top + bh);
  ctx.lineTo(cx - bottomW / 2, top + bh);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, top, 0, top + bh);
  g.addColorStop(0, "#a8733c");
  g.addColorStop(1, "#6b4219");
  ctx.fillStyle = g;
  ctx.fill();

  // 編織紋
  ctx.clip();
  ctx.strokeStyle = "rgba(255, 230, 190, 0.28)";
  ctx.lineWidth = 2;
  for (let i = 1; i < 4; i++) {
    const yy = top + (bh * i) / 4;
    ctx.beginPath();
    ctx.moveTo(cx - bw, yy);
    ctx.lineTo(cx + bw, yy);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(60, 35, 10, 0.3)";
  for (let xx = cx - bw; xx < cx + bw; xx += 12) {
    ctx.beginPath();
    ctx.moveTo(xx, top);
    ctx.lineTo(xx + 8, top + bh);
    ctx.stroke();
  }
  ctx.restore();

  // 籃口
  ctx.fillStyle = "#d9622b";
  ctx.beginPath();
  ctx.roundRect(cx - bw * 0.53, top - bh * 0.1, bw * 1.06, bh * 0.2, bh * 0.1);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(cx - bw * 0.45, top - bh * 0.07, bw * 0.9, 2);
}

/* ───────────── 元件 ───────────── */
export default function MangoCatchGame() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeBarRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [count, setCount] = useState(3);
  const [best, setBest] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const [counts, setCounts] = useState<Counts>({ normal: 0, golden: 0, rotten: 0 });

  // 遊戲中每一幀都會變的資料放在 ref，避免一直重新渲染
  const phaseRef = useRef<Phase>("ready");
  const g = useRef({
    W: 0,
    H: 0,
    items: [] as Item[],
    pops: [] as Pop[],
    basketX: 0,
    targetX: 0,
    elapsed: 0,
    spawnIn: 0,
    score: 0,
    shownSecond: DURATION,
    keys: { left: false, right: false },
    counts: { normal: 0, golden: 0, rotten: 0 } as Counts,
  });

  // 讀取最佳紀錄（只能在瀏覽器端讀）
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBest(readBest());
  }, []);

  // 畫布尺寸跟著外框調整（支援高解析度螢幕）
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const s = g.current;
      const firstTime = s.W === 0;
      s.W = width;
      s.H = height;
      if (firstTime) s.basketX = s.targetX = width / 2;
      s.basketX = Math.min(Math.max(s.basketX, 0), width);
      s.targetX = Math.min(Math.max(s.targetX, 0), width);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // 主迴圈
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;
    let last = performance.now();

    const finish = () => {
      const s = g.current;
      phaseRef.current = "over";
      setPhase("over");
      setScore(s.score);
      setCounts({ ...s.counts });
      const prev = readBest();
      const newBest = s.score > prev;
      setIsNewBest(newBest);
      if (newBest) {
        setBest(s.score);
        try {
          localStorage.setItem(BEST_KEY, String(s.score));
        } catch {
          // 存不了就算了
        }
      }
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05); // 切到背景再回來時不要一次跳很多
      last = now;
      const s = g.current;
      const { W, H } = s;
      const r = Math.min(Math.max(W * 0.042, 16), 28);
      const bw = Math.min(Math.max(W * 0.22, 90), 170);
      const bh = bw * 0.42;
      const by = H - bh - Math.max(H * 0.04, 12);

      /* 更新 */
      // 籃子：鍵盤移動＋平滑跟隨
      if (s.keys.left) s.targetX -= W * 1.1 * dt;
      if (s.keys.right) s.targetX += W * 1.1 * dt;
      s.targetX = Math.min(Math.max(s.targetX, bw / 2), W - bw / 2);
      s.basketX += (s.targetX - s.basketX) * Math.min(1, dt * 18);

      if (phaseRef.current === "playing") {
        s.elapsed += dt;
        const remaining = Math.max(0, DURATION - s.elapsed);
        if (timeBarRef.current) timeBarRef.current.style.transform = `scaleX(${remaining / DURATION})`;
        const sec = Math.ceil(remaining);
        if (sec !== s.shownSecond) {
          s.shownSecond = sec;
          setTimeLeft(sec);
        }

        // 越後面掉得越快、越密
        const t = s.elapsed / DURATION;
        s.spawnIn -= dt;
        if (s.spawnIn <= 0) {
          s.items.push({
            x: r + Math.random() * (W - r * 2),
            y: -r * 1.5,
            r,
            vy: H * (0.32 + 0.45 * t) * (0.85 + Math.random() * 0.3),
            rot: (Math.random() - 0.5) * 0.8,
            vr: (Math.random() - 0.5) * 2,
            kind: pickKind(),
          });
          s.spawnIn = (0.72 - 0.42 * t) * (0.6 + Math.random() * 0.8);
        }

        if (remaining <= 0) finish();
      }

      // 掉落與接住
      s.items = s.items.filter((it) => {
        it.y += it.vy * dt;
        it.rot += it.vr * dt;
        const bottom = it.y + it.r * 0.7;
        if (phaseRef.current === "playing" && bottom >= by && bottom <= by + bh * 0.6 && Math.abs(it.x - s.basketX) < bw / 2) {
          const p = POINTS[it.kind];
          s.score = Math.max(0, s.score + p);
          s.counts[it.kind]++;
          setScore(s.score);
          s.pops.push({
            x: it.x,
            y: by - 10,
            text: p > 0 ? `+${p}` : `${p}`,
            color: it.kind === "golden" ? "#c98a00" : it.kind === "rotten" ? "#6b4219" : "#d9622b",
            life: 1,
          });
          return false;
        }
        return it.y - it.r * 1.2 < H;
      });
      s.pops = s.pops.filter((p) => {
        p.y -= 50 * dt;
        p.life -= dt * 1.4;
        return p.life > 0;
      });

      /* 畫 */
      const dpr = canvas.width / (W || 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (const it of s.items) drawMango(ctx, it);
      drawBasket(ctx, s.basketX, by, bw, bh);
      ctx.textAlign = "center";
      for (const p of s.pops) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.font = `900 ${Math.round(r * 1.1)}px ui-serif, Georgia, serif`;
        ctx.fillText(p.text, p.x, p.y);
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 鍵盤：← → 或 A D
  useEffect(() => {
    const set = (e: KeyboardEvent, down: boolean) => {
      const k = e.key.toLowerCase();
      const playing = phaseRef.current === "playing" || phaseRef.current === "countdown";
      if (k === "arrowleft" || k === "a") {
        g.current.keys.left = down;
        if (playing) e.preventDefault();
      } else if (k === "arrowright" || k === "d") {
        g.current.keys.right = down;
        if (playing) e.preventDefault();
      }
    };
    const onDown = (e: KeyboardEvent) => set(e, true);
    const onUp = (e: KeyboardEvent) => set(e, false);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  // 倒數 3、2、1
  useEffect(() => {
    if (phase !== "countdown") return;
    // 3 → 2 → 1 → GO，GO 顯示一下再開始
    const id =
      count === 0
        ? setTimeout(() => {
            phaseRef.current = "playing";
            setPhase("playing");
          }, 450)
        : setTimeout(() => setCount((c) => c - 1), 700);
    return () => clearTimeout(id);
  }, [phase, count]);

  const start = () => {
    const s = g.current;
    s.items = [];
    s.pops = [];
    s.elapsed = 0;
    s.spawnIn = 0.2;
    s.score = 0;
    s.shownSecond = DURATION;
    s.counts = { normal: 0, golden: 0, rotten: 0 };
    if (timeBarRef.current) timeBarRef.current.style.transform = "scaleX(1)";
    setScore(0);
    setTimeLeft(DURATION);
    setIsNewBest(false);
    setCount(3);
    phaseRef.current = "countdown";
    setPhase("countdown");
  };

  const moveTo = (clientX: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) g.current.targetX = clientX - rect.left;
  };

  return (
    <div
      ref={wrapRef}
      className="relative aspect-[3/4] w-full select-none overflow-hidden rounded-[1.5rem] border border-white/60 bg-gradient-to-b from-[#fdf6e9] via-[#f9e7c6] to-[#f3d29f] shadow-[0_30px_70px_-30px_rgba(178,54,29,0.45)] sm:aspect-[4/3] md:rounded-[2rem]"
    >
      {/* 背景裝飾：遠方的果樹剪影 */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(ellipse_at_20%_100%,rgba(44,65,40,0.18),transparent_60%),radial-gradient(ellipse_at_80%_100%,rgba(44,65,40,0.14),transparent_55%)]" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        onPointerMove={(e) => moveTo(e.clientX)}
        onPointerDown={(e) => moveTo(e.clientX)}
        aria-label="接芒果遊戲畫面"
        role="img"
      />

      {/* 上方資訊列 */}
      {(phase === "playing" || phase === "countdown") && (
        <div className="pointer-events-none absolute inset-x-0 top-0 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-full border border-white/60 bg-white/45 px-4 py-1.5 backdrop-blur-md">
              <span className="text-xs text-muted">得分</span>
              <span className="ml-2 font-en text-2xl font-semibold tabular-nums">{score}</span>
            </div>
            <div className="rounded-full border border-white/60 bg-white/45 px-4 py-1.5 backdrop-blur-md">
              <span className={`font-en text-2xl font-semibold tabular-nums ${timeLeft <= 3 ? "text-mango" : ""}`}>{timeLeft}</span>
              <span className="ml-1 text-xs text-muted">秒</span>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10">
            <div ref={timeBarRef} className="h-full origin-left rounded-full bg-gradient-to-r from-[#ffb35c] to-mango" />
          </div>
        </div>
      )}

      {/* 倒數 */}
      {phase === "countdown" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span key={count} className="welcome-in font-serif text-8xl font-black text-mango drop-shadow-[0_8px_20px_rgba(178,54,29,0.35)]">
            {count || "GO"}
          </span>
        </div>
      )}

      {/* 開始畫面 */}
      {phase === "ready" && (
        <Overlay>
          <p className="font-en text-sm italic text-mango">Mango Catch</p>
          <h2 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">接芒果！</h2>
          <p className="mt-3 text-sm leading-7 text-ink/75">
            {DURATION} 秒內移動籃子，接住掉下來的芒果。
          </p>
          <ul className="mt-5 grid grid-cols-3 gap-2 text-xs">
            <Legend kind="normal" label="芒果" points="+1" />
            <Legend kind="golden" label="金芒果" points="+3" />
            <Legend kind="rotten" label="爛芒果" points="−2" />
          </ul>
          <p className="mt-5 text-xs leading-6 text-muted">
            電腦：滑鼠或 ← → 鍵　手機：手指左右滑
          </p>
          {best > 0 && <p className="mt-1 text-xs text-muted">你的最佳紀錄：{best} 分</p>}
          <button
            type="button"
            onClick={start}
            autoFocus
            className="mt-6 w-full rounded-full bg-ink py-3.5 text-sm font-medium text-paper transition hover:bg-mango"
          >
            開始遊戲
          </button>
        </Overlay>
      )}

      {/* 結算畫面 */}
      {phase === "over" && (
        <Overlay>
          <p className="font-en text-sm italic text-mango">Time&apos;s up!</p>
          <p className="mt-2 font-en text-7xl font-semibold leading-none tabular-nums">{score}</p>
          <p className="mt-1 text-sm text-muted">分</p>
          <p className="mt-4 font-serif text-2xl font-bold">
            {isNewBest ? "新紀錄！" : ""}
            {rating(score)}
          </p>
          <ul className="mt-5 grid grid-cols-3 gap-2 text-xs">
            <Legend kind="normal" label="芒果" points={`× ${counts.normal}`} />
            <Legend kind="golden" label="金芒果" points={`× ${counts.golden}`} />
            <Legend kind="rotten" label="爛芒果" points={`× ${counts.rotten}`} />
          </ul>
          <p className="mt-4 text-xs text-muted">最佳紀錄：{Math.max(best, score)} 分</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={start}
              autoFocus
              className="flex-1 rounded-full bg-ink py-3.5 text-sm font-medium text-paper transition hover:bg-mango"
            >
              再玩一次
            </button>
            <Link
              href="/#shop"
              className="flex-1 rounded-full border border-ink/25 py-3.5 text-center text-sm font-medium transition hover:border-ink"
            >
              吃真的芒果 →
            </Link>
          </div>
        </Overlay>
      )}
    </div>
  );
}

function Overlay({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-ink/10 p-4 backdrop-blur-[2px]">
      <div className="welcome-in relative w-full max-w-sm overflow-hidden rounded-[1.5rem] border border-white/70 bg-paper/80 p-6 text-center shadow-[0_25px_60px_-20px_rgba(29,35,24,0.45)] backdrop-blur-xl sm:p-8">
        <div aria-hidden className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        {children}
      </div>
    </div>
  );
}

function Legend({ kind, label, points }: { kind: Kind; label: string; points: string }) {
  const [light, base, dark] = COLORS[kind];
  return (
    <li className="flex flex-col items-center gap-1.5 rounded-2xl border border-ink/10 bg-white/50 px-2 py-3">
      <span
        aria-hidden
        className="block h-7 w-6 rounded-[50%]"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${light} 0%, ${base} 55%, ${dark} 100%)`,
          boxShadow: kind === "golden" ? "0 0 12px rgba(255,196,30,0.8)" : undefined,
        }}
      />
      <span>{label}</span>
      <span className="font-en text-base font-semibold">{points}</span>
    </li>
  );
}
