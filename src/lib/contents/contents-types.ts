import type { ImageMetadata } from "astro";
import type { JSX } from "solid-js";
import { Either } from "effect";

export type Collections = {
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
  icon: Either.Either<() => JSX.Element, ImageMetadata>;
  // icon?: () => JSX.Element;
  // image?: ImageMetadata;
};
