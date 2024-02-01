import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";
import rehypePrettyCode from "rehype-pretty-code";

import theme from "./pretty-code-theme.json";

const prettyCodeOptions = {
  theme: theme,
};

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), tailwind()],
  output: "server",
  adapter: vercel(),
  markdown: {
    rehypePlugins: [rehypePrettyCode, [prettyCodeOptions]],
    shikiConfig: {
      theme: theme,
    },
  },
});
