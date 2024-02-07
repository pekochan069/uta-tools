import { Effect, pipe } from "effect";

import { type ErrorType } from "~/lib/types";

export type CookieError = ErrorType;

export type NetscapeCookie = {
  domain: string;
  includeSubdomains: "TRUE" | "FALSE";
  path: string;
  httpOnly: "TRUE" | "FALSE";
  expirationDate: number;
  name: string;
  value: string;
};

const JSONParseError: CookieError = {
  _tag: "JSONParseError",
  message: "Failed to parse JSON",
};

const NoRequiredFieldError: CookieError = {
  _tag: "NoRequiredFieldError",
  message: "Missing required field",
};

const NotNetscapeCookieError: CookieError = {
  _tag: "NotNetscapeCookieError",
  message: "Not a Netscape cookie format",
};

const JSONStringifyError: CookieError = {
  _tag: "StringifyError",
  message: "Failed to stringify data",
};

// biome-ignore lint/suspicious/noExplicitAny: JSON parsed input
const toArray = (input: any) => {
  if (Array.isArray(input)) {
    return input;
  }

  return [input];
};

const splitString = (input: string) => {
  return input.split("\n");
};

const removeEmptyLines = (input: string[]) => {
  return input.filter((line) => line.trim() !== "");
};

const parseJSON = (input: string) => {
  return Effect.try({
    try: () => JSON.parse(input),
    catch: () => JSONParseError,
  });
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const objectToSting = (input: any, format: "pretty" | "minify" = "pretty") => {
  return Effect.try({
    try: () => JSON.stringify(input, undefined, format === "pretty" ? 2 : 0),
    catch: () => JSONStringifyError,
  });
};

// biome-ignore lint/suspicious/noExplicitAny: JSON parsed input
const singleJsonToNetscape = (cookie: any) => {
  return Effect.try({
    try: () => {
      const netscapeCookie: NetscapeCookie = {
        domain: cookie.domain,
        includeSubdomains: cookie.domain.startsWith(".") ? "TRUE" : "FALSE",
        path: cookie.path,
        httpOnly: cookie.httpOnly ? "TRUE" : "FALSE",
        expirationDate: cookie.expirationDate
          ? Math.floor(cookie.expirationDate)
          : 0,
        name: cookie.name,
        value: cookie.value,
      };

      return netscapeCookie;
    },
    catch: () => NoRequiredFieldError,
  });
};

const netscapeToString = (cookies: NetscapeCookie[]) => {
  const lines = cookies
    .map((cookie) => {
      return `${cookie.domain}\t${cookie.includeSubdomains}\t${cookie.path}\t${cookie.httpOnly}\t${cookie.expirationDate}\t${cookie.name}\t${cookie.value}`;
    })
    .join("\n");

  return `# Netscape HTTP Cookie File\n${lines}`;
};

export const jsonToNetscape = (input: string) => {
  return pipe(
    input,
    parseJSON,
    Effect.map(toArray),
    Effect.flatMap(Effect.forEach(singleJsonToNetscape)),
    Effect.map(netscapeToString),
  );
};

const checkNetscapeCookie = (
  input: string[],
): Effect.Effect<never, CookieError, string[]> => {
  if (
    input[0].trim() === "# Netscape HTTP Cookie File" ||
    input[0].trim() === "# HTTP Cookie File"
  ) {
    return Effect.succeed(input.slice(1));
  }

  return Effect.fail(NotNetscapeCookieError);
};

const removeComments = (input: string[]) => {
  return input.filter((line) => !line.startsWith("#"));
};

const singleNetscapeToJson = (cookie: string) => {
  return Effect.try({
    try: () => {
      const fields = cookie.split("\t");
      const netscapeCookie: NetscapeCookie = {
        domain: fields[0],
        includeSubdomains: fields[1] as "TRUE" | "FALSE",
        path: fields[2],
        httpOnly: fields[3] as "TRUE" | "FALSE",
        expirationDate: Number(fields[4]),
        name: fields[5],
        value: fields[6],
      };

      return netscapeCookie;
    },
    catch: () => NoRequiredFieldError,
  });
};

export const netscapeToJson = (input: string, format: "pretty" | "minify") => {
  return pipe(
    input,
    splitString,
    removeEmptyLines,
    checkNetscapeCookie,
    Effect.map(removeComments),
    Effect.flatMap(Effect.forEach(singleNetscapeToJson)),
    Effect.flatMap((cookies) => objectToSting(cookies, format)),
  );
};
