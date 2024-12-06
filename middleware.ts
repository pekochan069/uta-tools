const { next, rewrite } = require("@vercel/edge");

function middleware(request: Request) {
  const url = new URL(request.url);

  console.log(1);
  const paths = url.pathname.split("/");
  if (paths[1] !== "en" && paths[1] !== "ko") {
    console.log(2);
    return Response.redirect(new URL(`/ko${url.pathname}`, url.origin));
  }

  if (
    url.pathname === "/ko/tools/converters/images" ||
    url.pathname === "/en/tools/converters/images"
  ) {
    console.log(3);
    return next({
      headers: {
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
      },
    });
  }

  console.log(4);
  return next();
}

module.exports = middleware;
