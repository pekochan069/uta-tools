import { atom } from "nanostores";

export type CookieFormat = "json" | "netscape";

export const format = atom<{ from: CookieFormat; to: CookieFormat }>({
  from: "json",
  to: "netscape",
});

export const jsonFormat = atom("pretty" as "pretty" | "minify");

export const input = atom("");
export const output = atom({
  status: "valid" as "valid" | "invalid",
  value: "",
});
