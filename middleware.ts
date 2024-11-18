import { next } from "@vercel/edge";

export default function middleware() {
  return next({
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  });
}
