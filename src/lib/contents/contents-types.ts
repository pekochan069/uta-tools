import type { Lang } from "~/i18n/utils";
import type { JSX } from "solid-js";
import { Either } from "effect";

export type Collections = {
  name: string;
  slug: string;
  categories: ContentsCategory[];
  i18n: Record<Lang, string>;
  description: Record<Lang, string>;
};

export type ContentsCategory = {
  name: string;
  i18n: Record<Lang, string>;
  slug: string;
  description: Record<Lang, string>;
  contents: Content[];
};

export type Content = {
  name: string;
  i18n: Record<Lang, string>;
  slug: string;
  description: Record<Lang, string>;
  icon: Either.Either<string, () => JSX.Element>;
};
