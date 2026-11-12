// Email 通知表單的下拉選單選項。
// 目前表單沒有開啟選單；之後要用時，把這份清單傳給 <EmailSignup options={...} /> 就會出現。
export type SignupOption = { value: string; label: string };

export const VARIETY_OPTIONS: SignupOption[] = [
  { value: "all", label: "全部品種" },
  { value: "native", label: "土芒果（5 – 6 月）" },
  { value: "irwin", label: "愛文芒果（6 – 7 月）" },
  { value: "jinhwang", label: "金煌芒果（7 – 8 月）" },
];
