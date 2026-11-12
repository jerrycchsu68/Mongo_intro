"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";

// 稱呼會存在訪客自己瀏覽器的 localStorage，下次進來直接顯示，不再詢問。
const STORAGE_KEY = "yujing-mango:nickname";
const MAX_LEN = 20;

type WelcomeContextValue = { name: string; changeName: () => void };
const WelcomeContext = createContext<WelcomeContextValue>({ name: "", changeName: () => {} });

// localStorage 在無痕模式或被封鎖時可能會丟錯，一律包起來
function readSaved() {
  try {
    return localStorage.getItem(STORAGE_KEY)?.trim().slice(0, MAX_LEN) ?? "";
  } catch {
    return "";
  }
}
function save(value: string) {
  try {
    if (value) localStorage.setItem(STORAGE_KEY, value);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 存不了就算了，這次瀏覽仍然會顯示
  }
}

/** 包住整個頁面：沒有存過稱呼就跳出輸入視窗；有存過就直接打招呼 */
export function WelcomeProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState("");
  const [draft, setDraft] = useState("");
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const openDialog = () => {
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
  };

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClose = () => {
      document.documentElement.style.overflow = "";
    };
    dialog.addEventListener("close", onClose);

    const saved = readSaved();
    if (saved) {
      // 只能在瀏覽器端讀 localStorage，所以載入後才設定
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(saved);
    } else {
      openDialog();
    }

    return () => {
      dialog.removeEventListener("close", onClose);
      document.documentElement.style.overflow = "";
    };
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = draft.trim().slice(0, MAX_LEN);
    if (!value) return;
    setName(value);
    save(value);
    ref.current?.close();
  };

  // 「更換」：帶入目前的稱呼，重新打開輸入視窗（按略過則維持原本的稱呼）
  const changeName = () => {
    setDraft(name);
    openDialog();
  };

  return (
    <WelcomeContext.Provider value={{ name, changeName }}>
      {children}

      <dialog
        ref={ref}
        aria-labelledby={titleId}
        className="modal m-auto w-[calc(100%-2rem)] max-w-md overflow-visible bg-transparent p-0 text-ink backdrop:bg-ink/45 backdrop:backdrop-blur-md"
      >
        <form
          onSubmit={submit}
          className="relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-paper/90 p-7 text-center shadow-[0_30px_80px_-20px_rgba(29,35,24,0.55)] backdrop-blur-2xl sm:p-10"
        >
          <div aria-hidden className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
          {/* 芒果色光點裝飾 */}
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffd683,#ee8a2d_55%,transparent_70%)] opacity-60 blur-xl" />

          <p className="relative font-en text-sm italic text-mango">Welcome to the orchard</p>
          <h2 id={titleId} className="relative mt-2 font-serif text-[1.7rem] font-bold leading-snug sm:text-3xl">
            歡迎來到玉井夏芒
          </h2>
          <p className="relative mt-3 text-sm leading-7 text-ink/70">先認識一下，我們該怎麼稱呼你？</p>

          <label className="relative mt-7 block text-left">
            <span className="sr-only">你的稱呼</span>
            <input
              type="text"
              name="nickname"
              autoFocus
              autoComplete="nickname"
              maxLength={MAX_LEN}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="例如：小芒、陳小姐"
              className="h-14 w-full rounded-full border border-ink/15 bg-white/70 px-6 text-center text-base outline-none transition placeholder:text-muted/70 focus:border-mango focus:bg-white"
            />
          </label>

          <button
            type="submit"
            disabled={!draft.trim()}
            className="relative mt-4 h-14 w-full rounded-full bg-ink text-sm font-medium text-paper transition hover:bg-mango disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink"
          >
            進入官網
          </button>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="relative mt-3 text-sm text-muted underline-offset-4 transition hover:text-ink hover:underline"
          >
            略過
          </button>
          <p className="relative mt-4 text-xs text-muted/80">稱呼只會存在你的瀏覽器裡，下次來訪會直接跟你打招呼。</p>
        </form>
      </dialog>
    </WelcomeContext.Provider>
  );
}

/** 有稱呼才會顯示的歡迎文字，旁邊附「更換」按鈕 */
export function WelcomeGreeting({ className = "" }: { className?: string }) {
  const { name, changeName } = useContext(WelcomeContext);
  if (!name) return null;
  return (
    <p className={`welcome-in flex flex-wrap items-baseline gap-x-3 gap-y-1 ${className}`} aria-live="polite">
      <span className="font-serif text-lg sm:text-xl">
        Hi，<span className="font-bold text-mango">{name}</span>！歡迎來到玉井夏芒
      </span>
      <button
        type="button"
        onClick={changeName}
        className="text-xs text-muted underline underline-offset-4 transition hover:text-ink"
      >
        更換
      </button>
    </p>
  );
}
