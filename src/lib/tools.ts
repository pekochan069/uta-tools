import type { JSX } from "astro/jsx-runtime";

import * as Icons from "~/components/icons";

type ToolCategory = {
	name: string;
	description: string;
	tools: Tool[];
};

type Tool = {
	name: string;
	description: string;
	href: string;
	icon: () => JSX.Element;
};

export const tools: ToolCategory[] = [
	{
		name: "Converters",
		description: "Convert between different formats",
		tools: [
			{
				name: "Base64",
				description: "Encode/Decode base64 formatted strings",
				href: "/tools/converters/base64",
				icon: Icons.Base64Icon,
			},
			{
				name: "Base64 Image",
				description: "Convert an image to a base64 encoded string",
				href: "/tools/converters/base64-image",
				icon: Icons.Base64ImageIcon,
			},
			{
				name: "Hex",
				description: "Encode/Decode hex values to/from strings",
				href: "/tools/converters/hex",
				icon: Icons.HexIcon,
			},
		],
	},
	{
		name: "Youtube",
		description: "Youtube related tools",
		tools: [
			{
				name: "Timeline",
				description: "Create a timeline of a youtube video",
				href: "/tools/youtube/timeline",
				icon: Icons.TimelineIcon,
			},
		],
	},
	{
		name: "Image",
		description: "Image manipulation tools",
		tools: [],
	},
];
