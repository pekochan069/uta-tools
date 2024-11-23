// import { next } from "@vercel/edge";
const { next } = require("@vercel/edge");

function middleware(request: Request) {
  const url = new URL(request.url);

  if (url.pathname === "/tools/converters/images") {
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
