"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "../app/actions";
import type { SignupOption } from "../lib/signup-options";

type EmailSignupProps = {
  /** 傳入選項就會顯示下拉選單；不傳則只有 Email 欄位 */
  options?: SignupOption[];
  selectLabel?: string;
  submitLabel?: string;
};

const initialState: SubscribeState = { status: "idle", message: "" };

export default function EmailSignup({ options, selectLabel = "想收到的通知", submitLabel = "通知我" }: EmailSignupProps) {
  const [state, formAction, pending] = useActionState(subscribe, initialState);
  const done = state.status === "success";

  return (
    <form action={formAction} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        {/* 下拉選單：有傳 options 才會出現 */}
        {options && options.length > 0 && (
          <label className="relative sm:w-56">
            <span className="sr-only">{selectLabel}</span>
            <select
              name="interest"
              defaultValue={options[0].value}
              disabled={pending || done}
              className="h-14 w-full appearance-none rounded-full border border-white/50 bg-white/20 pl-5 pr-10 text-white backdrop-blur-md outline-none transition focus:border-white focus:bg-white/30 [&>option]:text-ink"
            >
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/80">
              ▾
            </span>
          </label>
        )}

        <label className="flex-1">
          <span className="sr-only">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="輸入你的 Email"
            disabled={pending || done}
            className="h-14 w-full rounded-full border border-white/50 bg-white/20 px-6 text-white placeholder:text-white/70 backdrop-blur-md outline-none transition focus:border-white focus:bg-white/30 disabled:opacity-70"
          />
        </label>

        <button
          type="submit"
          disabled={pending || done}
          className="h-14 shrink-0 rounded-full bg-ink px-8 text-sm font-medium text-paper transition hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:opacity-80"
        >
          {pending ? "送出中…" : done ? "已收到 ✓" : submitLabel}
        </button>
      </div>

      <p
        aria-live="polite"
        className={`mt-3 min-h-6 px-2 text-sm ${state.status === "error" ? "font-medium text-[#fff3c4]" : "text-white/90"}`}
      >
        {state.message || "我們只會寄送產季通知，不會把你的 Email 分享給其他人。"}
      </p>
    </form>
  );
}
