import { atom } from "nanostores";

/**
 * Base64 converter atoms
 * `true` for encoding, `false` for decoding
 */
export const operation = atom(true);
export const repeat = atom(1);

export const input = atom("");
export const output = atom({
  status: "valid" as "valid" | "invalid",
  value: "",
});
