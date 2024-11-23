import type { Collections } from "./contents-types";
import { None, Some } from "~/lib/types";
import { tldr } from "./tldr";
import { tools } from "./tools";

export const collections: Collections[] = [
  {
    name: "Tools",
    slug: "tools",
    categories: tools,
    i18n: {
      ko: "도구 모음",
      en: "Tools",
    },
    description: {
      ko: "버튜버 우타와꾸 갤러리를 위한 도구 모음",
      en: "A collection of tools for Vtuber Utawaku Gallery",
    },
  },
  // {
  //   name: "tldr",
  //   slug: "tldr",
  //   categories: tldr,
  //   i18n: {
  //     ko: "요약 모음",
  //     en: "tldr",
  //   },
  //   description: {
  //     ko: "버튜버 우타와꾸 갤러리를 위한 요약 모음",
  //     en: "A collection of tldr for Vtuber Utawaku Gallery",
  //   },
  // },
];

export function getContent(collectionSlug: string, categorySlug: string, contentSlug: string) {
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
    collection: collection.i18n,
    category: category.i18n,
    name: content.name,
    description: content.description,
    i18n: content.i18n,
  });
}
