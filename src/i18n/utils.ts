export const languages: Record<Lang, string> = {
  en: "English",
  ko: "한국어",
};

export const defaultLang: Lang = "ko";

export type Lang = "en" | "ko";

export const langs: Set<Lang> = new Set(["en", "ko"]);
export const langNames: Record<Lang, string> = {
  en: "English",
  ko: "한국어",
};
