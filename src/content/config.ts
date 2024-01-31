import { z, defineCollection } from "astro:content";

const tldrCollection = defineCollection({
	type: "content",
	schema: z.object({
		category: z.string(),
		name: z.string(),
		description: z.optional(z.string()),
		tags: z.optional(z.array(z.string())),
	}),
});

export const collections = {
	tldr: tldrCollection,
};
