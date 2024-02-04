import { None, Some } from "~/lib/types";
import type { Collections } from "./contents-types";
import { tldr } from "./tldr";
import { tools } from "./tools";

export const collections: Collections[] = [
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
  collectionSlug: string,
  categorySlug: string,
  contentSlug: string,
) {
  const collection = collections.find((c) => c.slug === collectionSlug);
  if (!collection) {
    return None();
  }

  const category = collection.categories.find((c) => c.slug === categorySlug);
  if (!category) {
    return None();
  }

  const content = category.contents.find((c) => c.slug === contentSlug);

  if (!content) {
    return None();
  }

  return Some({
    collection: collection.name,
    category: category.name,
    name: content.name,
    description: content.description,
  });
}
