import { atom } from "nanostores";

export const currentContent = atom({
  collection: "",
  category: "",
  name: "",
  description: "",
});
