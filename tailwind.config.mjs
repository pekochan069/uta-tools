/** @type {import("tailwindcss").Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,js,jsx,ts,tsx,mdx}"],
  presets: [require("./ui.preset.js")],
  plugins: [
    require("@kobalte/tailwindcss"),
    require("@tailwindcss/container-queries"),
  ],
  theme: {
    extend: {
      colors: {
        "code-muted": "#ffffff88",
      },
    },
  },
};
