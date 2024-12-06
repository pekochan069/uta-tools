// const { next } = require("@vercel/edge");
import { next, rewrite } from "@vercel/edge";

function middleware(request: Request) {
  const url = new URL(request.url);

  if (!url.pathname.startsWith("/ko") && !url.pathname.startsWith("/en")) {
    return rewrite(new URL(`/ko${url.pathname}`, request.url));
  }

  if (url.pathname.endsWith("/tools/converters/images")) {
    return next({
      headers: {
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
      },
    });
  }

  return next();
}

module.exports = middleware;
