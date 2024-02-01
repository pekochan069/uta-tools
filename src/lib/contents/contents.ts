import { None, Some } from "~/lib/types";
import type { Contents } from "./contents-types";
import { tldr } from "./tldr";
import { tools } from "./tools";

export const contents: Contents[] = [
  {
    name: "Tools",
    slug: "tools",
    categories: tools,
  },
  {
    name: "tldr",
    slug: "tldr",
    categories: tldr,
  },
];

export function getContent(
  largeCategorySlug: string,
  categorySlug: string,
  contentSlug: string,
) {
  const largeCategory = contents.find((c) => c.slug === largeCategorySlug);
  if (!largeCategory) {
    return None();
  }

  const category = largeCategory.categories.find(
    (c) => c.slug === categorySlug,
  );
  if (!category) {
    return None();
  }

  const content = category.contents.find((c) => c.slug === contentSlug);

  if (!content) {
    return None();
  }

  return Some({
    largeCategory: largeCategory.name,
    category: category.name,
    name: content.name,
    description: content.description,
  });
}
