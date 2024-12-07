import { next } from "@vercel/edge";
import { siteConfig } from "./src/config";

const prod = process.env.NODE_ENV === "production";

const locales = siteConfig.locales.map(
  (locale) =>
    `${prod ? "https://uta-tools.vercel.app" : "http://localhost:3000"}/${locale}/tools/converters/images`,
);

export default function middleware(request) {
  if (
    (request.headers.get("referer") && locales.includes(request.headers.get("referer"))) ||
    locales.includes(request.url) ||
    request.url.includes("vips") ||
    request.url.includes("worker") ||
    request.url.includes("embed")
  ) {
    const response = next();
    response.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
    response.headers.set("Cross-Origin-Opener-Policy", "same-origin");

    return response;
  }

  return next();
}
