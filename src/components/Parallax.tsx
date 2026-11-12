"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ParallaxProps = {
  children?: ReactNode;
  className?: string;
  /**
   * 位移強度，以「外層容器尺寸」的比例表示。
   * 正值：比頁面捲得慢（往後退）；負值：比頁面捲得快（往前浮）。
   */
  strength?: number;
  axis?: "y" | "x";
  /** 只在符合這個 media query 時啟用，例如 "(min-width: 1024px)" */
  media?: string;
};

// 依照元素在畫面中的位置，平移自己，做出視差效果
export default function Parallax({ children, className = "", strength = 0.1, axis = "y", media }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = el.parentElement ?? el; // 量外層，避免量到自己位移後的位置

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mq = media ? window.matchMedia(media) : null;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reduce.matches || (mq && !mq.matches)) {
        el.style.transform = "";
        return;
      }
      const rect = target.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < -100 || rect.top > vh + 100) return; // 不在畫面內就不算

      // -1：元素在畫面下方剛出現｜0：在正中間｜1：快離開上方
      const progress = Math.max(-1, Math.min(1, (vh / 2 - (rect.top + rect.height / 2)) / (vh / 2 + rect.height / 2)));
      const size = axis === "y" ? rect.height : rect.width;
      const offset = progress * strength * size;
      el.style.transform = axis === "y" ? `translate3d(0, ${offset}px, 0)` : `translate3d(${offset}px, 0, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduce.addEventListener("change", onScroll);
    mq?.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduce.removeEventListener("change", onScroll);
      mq?.removeEventListener("change", onScroll);
    };
  }, [strength, axis, media]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
