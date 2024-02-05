export type Theme = "system" | "light" | "dark";

const media = "(prefers-color-scheme: dark)";

export const getTheme = (fallback?: Theme) => {
  if (typeof window === "undefined") return undefined;

  let theme: Theme | undefined = undefined;
  try {
    theme = (localStorage.getItem("theme") as Theme) || undefined;
  } catch {
    /* empty */
  }

  if (theme === undefined) {
    if (fallback) {
      return fallback;
    }

    theme = window.matchMedia(media).matches ? "dark" : "light";
  }

  return theme;
};
