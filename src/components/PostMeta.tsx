import { formatDate } from "../lib/posts";

// 文章分類、日期、閱讀時間
export default function PostMeta({
  category,
  date,
  readMinutes,
  dark = false,
}: {
  category: string;
  date: string;
  readMinutes: number;
  dark?: boolean;
}) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${dark ? "text-white/85" : "text-muted"}`}>
      <span className="rounded-full bg-mango px-2.5 py-0.5 text-white">{category}</span>
      <time dateTime={date}>{formatDate(date)}</time>
      <span aria-hidden>·</span>
      <span>閱讀約 {readMinutes} 分鐘</span>
    </p>
  );
}
