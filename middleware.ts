const { next, rewrite } = require("@vercel/edge");

function middleware(request: Request) {
  const url = new URL(request.url);

  const paths = url.pathname.split("/");
  if (paths[1] !== "en" && paths[1] !== "ko") {
    return rewrite(new URL(`/ko${url.pathname}`, url.origin));
  }

  if (
    url.pathname === "/ko/tools/converters/images" ||
    url.pathname === "/en/tools/converters/images"
  ) {
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
