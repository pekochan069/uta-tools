import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import paraglide from "@inlang/paraglide-astro";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    solidJs(),
    tailwind(),
    paraglide({
      project: "./project.inlang",
      outdir: "./src/paraglide",
    }),
  ],
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
  i18n: {
    locales: ["en", "ko"],
    defaultLocale: "ko",
  },
});
