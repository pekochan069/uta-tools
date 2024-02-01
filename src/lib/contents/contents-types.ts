import type { JSX } from "solid-js";

export type Contents = {
  name: string;
  slug: string;
  categories: ContentsCategory[];
};

export type ContentsCategory = {
  name: string;
  slug: string;
  description: string;
  contents: Content[];
};

export type Content = {
  name: string;
  slug: string;
  description: string;
  icon: () => JSX.Element;
};
