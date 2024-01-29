import type { Contents } from "./contents-types";
import { tldr } from "./tldr";
import { tools } from "./tools";

export const contents: Contents[] = [
	{
		name: "Tools",
		categories: tools,
	},
	{
		name: "tl;dr",
		categories: tldr,
	},
];
