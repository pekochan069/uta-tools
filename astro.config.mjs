import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import vercel from "@astrojs/vercel/serverless";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), tailwind()],
  output: "server",
  adapter: vercel(),
});