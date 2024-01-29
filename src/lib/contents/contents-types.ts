import type { JSX } from "solid-js";

export type Contents = {
	name: string;
	categories: ContentsCategory[];
}

export type ContentsCategory = {
	name: string;
	description: string;
	contents: Content[];
};

export type Content = {
	name: string;
	description: string;
	href: string;
	icon: () => JSX.Element;
};
