import { atom } from "nanostores";

export const currentContent = atom({
  name: "",
  collection: { ko: "", en: "" },
  category: { ko: "", en: "" },
  description: { ko: "", en: "" },
  i18n: { ko: "", en: "" },
});
