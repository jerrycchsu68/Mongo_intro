"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type ModalProps = {
  /** 按鈕上的文字或內容 */
  trigger: ReactNode;
  triggerClassName?: string;
  title: string;
  /** 標題上方的小字（選填） */
  eyebrow?: string;
  children: ReactNode;
};

/**
 * 按鈕＋彈出視窗。
 * 用瀏覽器原生 <dialog>：內建 Esc 關閉、鍵盤焦點鎖在視窗內、背景不可點。
 * 視窗內任何加上 data-modal-close 的元素，點了都會關閉視窗（例如「前往預購」連結）。
 */
export default function Modal({ trigger, triggerClassName = "", title, eyebrow, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const open = () => {
    ref.current?.showModal();
    document.documentElement.style.overflow = "hidden"; // 鎖住背景捲動
  };
  const close = () => ref.current?.close();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // 不論是按 Esc、點背景或按關閉鈕，都在這裡恢復捲動
    const onClose = () => {
      document.documentElement.style.overflow = "";
    };
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("close", onClose);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <>
      <button type="button" onClick={open} className={triggerClassName} aria-haspopup="dialog">
        {trigger}
      </button>

      <dialog
        ref={ref}
        aria-labelledby={titleId}
        className="modal m-auto w-[calc(100%-2rem)] max-w-xl overflow-visible bg-transparent p-0 text-ink backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
        onClick={(e) => {
          // 點到視窗外的背景就關閉
          if (e.target === e.currentTarget) close();
          // 點到 data-modal-close 的元素也關閉
          if ((e.target as HTMLElement).closest("[data-modal-close]")) close();
        }}
      >
        <div className="relative max-h-[85vh] overflow-y-auto rounded-[1.5rem] border border-white/60 bg-paper/90 p-6 shadow-[0_30px_80px_-20px_rgba(29,35,24,0.5)] backdrop-blur-2xl sm:p-10">
          {/* 玻璃高光 */}
          <div aria-hidden className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

          <div className="flex items-start justify-between gap-6">
            <div>
              {eyebrow && <p className="font-en text-sm italic text-mango">{eyebrow}</p>}
              <h2 id={titleId} className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
                {title}
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="關閉"
              className="-mr-2 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:bg-ink/10"
            >
              <span aria-hidden className="relative block h-4 w-4">
                <span className="absolute left-0 top-1/2 h-px w-4 rotate-45 bg-ink" />
                <span className="absolute left-0 top-1/2 h-px w-4 -rotate-45 bg-ink" />
              </span>
            </button>
          </div>

          <div className="mt-6">{children}</div>
        </div>
      </dialog>
    </>
  );
}
