const BENGALI_RANGE = /[\u0980-\u09FF]/;

export function isBanglaText(text: string): boolean {
  let bengali = 0;
  let other = 0;
  for (const ch of text) {
    if (BENGALI_RANGE.test(ch)) {
      bengali++;
    } else if (/[a-zA-Z]/.test(ch)) {
      other++;
    }
  }
  return bengali > other;
}

export function detectLanguage(text: string): "bn" | "en" {
  return isBanglaText(text) ? "bn" : "en";
}

export type UILang = "bn" | "en";

export const labels: Record<string, Record<UILang, string>> = {
  sources: { en: "Sources & References", bn: "সূত্র ও রেফারেন্স" },
  relevance: { en: "Relevance", bn: "প্রাসঙ্গিকতা" },
  confidence: { en: "Confidence", bn: "নির্ভরযোগ্যতা" },
  high: { en: "High", bn: "উচ্চ" },
  medium: { en: "Medium", bn: "মধ্যম" },
  low: { en: "Low", bn: "নিম্ন" },
  citation: { en: "Citation", bn: "উদ্ধৃতি" },
  chunk: { en: "chunk", bn: "অংশ" },
  chunks: { en: "chunks", bn: "অংশসমূহ" },
  copied: { en: "Copied!", bn: "কপি হয়েছে!" },
  copiedMsg: { en: "Answer copied to clipboard", bn: "উত্তর ক্লিপবোর্ডে কপি করা হয়েছে" },
  copy: { en: "Copy", bn: "কপি" },
  search: { en: "Search", bn: "অনুসন্ধান" },
  searchQuery: { en: "Search Query", bn: "অনুসন্ধান প্রশ্ন" },
  searchPlaceholder: { en: "Enter your search query...", bn: "আপনার অনুসন্ধান প্রশ্ন লিখুন..." },
  results: { en: "Results (top_k)", bn: "ফলাফল (top_k)" },
  jsonFilters: { en: "JSON Filters (optional)", bn: "JSON ফিল্টার (ঐচ্ছিক)" },
  caseFacts: { en: "Case Facts", bn: "মামলার তথ্য" },
  factsPlaceholder: { en: "Enter the facts of the case or legal scenario to analyze...", bn: "বিশ্লেষণের জন্য মামলার তথ্য লিখুন..." },
  analyzeFacts: { en: "Analyze Facts", bn: "তথ্য বিশ্লেষণ করুন" },
  legalAnalysis: { en: "Legal Analysis", bn: "আইনি বিশ্লেষণ" },
  actName: { en: "Act Name", bn: "আইনের নাম" },
  actNamePlaceholder: { en: "e.g. The Penal Code, 1860", bn: "যেমন: দ্য পেনাল কোড, ১৮৬০" },
  summarize: { en: "Summarize", bn: "সারসংক্ষেপ" },
  summary: { en: "Summary", bn: "সারসংক্ষেপ" },
  answer: { en: "Answer", bn: "উত্তর" },
  searchFailed: { en: "Search failed. Please try again.", bn: "অনুসন্ধান ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" },
  analysisFailed: { en: "Analysis failed. Please try again.", bn: "বিশ্লেষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" },
  summaryFailed: { en: "Summary failed. Please try again.", bn: "সারসংক্ষেপ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" },
};

export function t(key: string, lang: UILang): string {
  return labels[key]?.[lang] ?? labels[key]?.en ?? key;
}

export function plural(key: string, count: number, lang: UILang): string {
  if (lang === "bn") return t(key, lang);
  return count === 1 ? t(key, lang) : t(key + "s", lang);
}
