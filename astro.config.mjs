import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), tailwind()],
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  vite: {
    optimizeDeps: {
      exclude: ["wasm-vips"],
    },
  },
});
