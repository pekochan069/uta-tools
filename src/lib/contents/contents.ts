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
