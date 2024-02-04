/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:solid/typescript",
    "plugin:astro/recommended",
    "biome",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "solid", "codegen"],
  root: true,
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    "codegen/codegen": "error",
  },
  overrides: [
    {
      // Define the configuration for `.astro` file.
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
      rules: {
        // "astro/no-set-html-directive": "error"
      },
    },
  ],
};
