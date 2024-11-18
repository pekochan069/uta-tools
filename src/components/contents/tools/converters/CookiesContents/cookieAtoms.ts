import { atom } from "nanostores";

export type CookieFormat = "json" | "netscape" | null;

export const format = atom<{ from: CookieFormat; to: CookieFormat }>({
  from: "json",
  to: "netscape",
});

export const jsonFormat = atom("pretty" as "pretty" | "minify" | null);

export const input = atom("");
export const output = atom({
  status: "valid" as "valid" | "invalid",
  value: "",
});
