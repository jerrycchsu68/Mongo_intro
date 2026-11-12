"use server";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomInt } from "node:crypto";
import path from "node:path";
import { cookies } from "next/headers";
import { VARIETY_OPTIONS } from "../lib/signup-options";

export type SubscribeState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const rawInterest = formData.get("interest");
  const interest = rawInterest ? String(rawInterest) : null;

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return { status: "error", message: "請輸入正確的 Email 格式，例如 name@example.com。" };
  }
  // 有選單時才檢查，避免被送進不存在的選項
  if (interest && !VARIETY_OPTIONS.some((o) => o.value === interest)) {
    return { status: "error", message: "請從選單中選擇一個項目。" };
  }

  // 目前先不儲存 Email，只回覆使用者。
  // 之後要開始收名單時，在這裡把 email、interest 存進資料庫或電子報服務即可。
  return { status: "success", message: "收到了！請等待我們的好消息 🥭" };
}

/* ───────────── 抽獎：10% 機會獲得 9 折優惠碼 ───────────── */

export type LotteryResult =
  | { outcome: "win"; code: string; alreadyPlayed: boolean }
  | { outcome: "lose"; alreadyPlayed: boolean }
  | { outcome: "error"; message: string };

type Coupon = { code: string; discount: number; createdAt: string; used: boolean };

const WIN_RATE = 10; // 百分比
const LOTTERY_COOKIE = "mango_lottery";
const COUPON_FILE = path.join(process.cwd(), "data", "coupons.json");
// 去掉容易看錯的 0/O、1/I/L
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function makeCode() {
  let s = "";
  for (let i = 0; i < 6; i++) s += CODE_CHARS[randomInt(CODE_CHARS.length)];
  return `MANGO-${s}`;
}

// 抽獎在伺服器端進行，前端轉盤只負責播放結果，使用者改不了中獎機率。
// 用 cookie 記錄抽過的人，每個瀏覽器限抽一次。
// （清除 cookie 或換瀏覽器仍可再抽；若要嚴格限制，需搭配會員登入。）
export async function drawLottery(): Promise<LotteryResult> {
  const jar = await cookies();
  const previous = jar.get(LOTTERY_COOKIE)?.value;
  if (previous) {
    return previous.startsWith("win:")
      ? { outcome: "win", code: previous.slice(4), alreadyPlayed: true }
      : { outcome: "lose", alreadyPlayed: true };
  }

  const win = randomInt(100) < WIN_RATE;
  const cookieOptions = { httpOnly: true, sameSite: "lax" as const, maxAge: 60 * 60 * 24 * 365, path: "/" };

  if (!win) {
    jar.set(LOTTERY_COOKIE, "lose", cookieOptions);
    return { outcome: "lose", alreadyPlayed: false };
  }

  try {
    let coupons: Coupon[] = [];
    try {
      coupons = JSON.parse(await readFile(COUPON_FILE, "utf8"));
    } catch {
      // 檔案還不存在
    }
    let code = makeCode();
    while (coupons.some((c) => c.code === code)) code = makeCode();

    coupons.push({ code, discount: 0.9, createdAt: new Date().toISOString(), used: false });
    await mkdir(path.dirname(COUPON_FILE), { recursive: true });
    await writeFile(COUPON_FILE, JSON.stringify(coupons, null, 2), "utf8");

    jar.set(LOTTERY_COOKIE, `win:${code}`, cookieOptions);
    return { outcome: "win", code, alreadyPlayed: false };
  } catch (err) {
    console.error("產生優惠碼失敗", err);
    return { outcome: "error", message: "系統忙碌中，請稍後再試一次。" };
  }
}
