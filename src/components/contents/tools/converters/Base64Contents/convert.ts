import { Effect } from "effect";

import { type ErrorType } from "~/lib/types";

type Base64Error = ErrorType;

const Base64EncodeError: Base64Error = {
  _tag: "Base64EncodeError",
  message: "Failed to encode string to base64 format",
};

const Base64DecodeError: Base64Error = {
  _tag: "Base64DecodeError",
  message: "Input is not a valid base64 string",
};

const encode = (input: string) => {
  return Effect.try({
    try: () => btoa(input),
    catch: () => Base64EncodeError,
  });
};

const decode = (input: string) => {
  return Effect.try({
    try: () => atob(input),
    catch: () => Base64DecodeError,
  });
};

export const execute = (input: string, repeat: number, operation: boolean) => {
  return Effect.gen(function* (_) {
    let out = input;

    const op = operation ? encode : decode;

    for (let i = 0; i < repeat; i++) {
      out = yield* _(op(out));
    }

    return out;
  });
};
