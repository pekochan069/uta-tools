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
		name: "tl;dr",
		slug: "tldr",
		categories: tldr,
	},
];

export function getContent(largeCategorySlug: string, categorySlug: string, contentSlug: string) {
	const largeCategory = contents.find((c) => c.slug === largeCategorySlug);
	if (!largeCategory) {
		return null;
	}

	const category = largeCategory.categories.find((c) => c.slug === categorySlug);
	if (!category) {
		return null;
	}

	return category.contents.find((c) => c.slug === contentSlug);
}