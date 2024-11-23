import { Effect } from "effect";
import { type ErrorType } from "~/lib/types";

type Hex64Error = ErrorType;

const HexEncodeError: Hex64Error = {
  _tag: "HexEncodeError",
  message: "Failed to encode string to hex format",
};

const HexDecodeError: Hex64Error = {
  _tag: "HexDecodeError",
  message: "Input is not a valid hex string",
};

const encode = (input: string) => {
  return Effect.try({
    try: () =>
      input
        .split("")
        .map((char) => char.charCodeAt(0).toString(16))
        .join(" "),
    catch: () => HexEncodeError,
  });
};

const findHex = (input: string) => {
  return Effect.try({
    try: () => {
      const res = input.match(/.{1,2}/g);

      if (res === null) {
        throw HexDecodeError;
      }

      return res;
    },
    catch: () => HexDecodeError,
  });
};

export const execute = (input: string, repeat: number, operation: boolean) => {
  return Effect.gen(function* (_) {
    let out = input;

    for (let i = 0; i < repeat; i++) {
      if (operation) {
        out = yield* _(encode(out));
      } else {
        out = yield* _(
          out.split(" ").join(""),
          findHex,
          Effect.map((res) => res.map((hex) => String.fromCharCode(parseInt(hex, 16))).join("")),
        );
      }
    }

    return out;
  });
};
