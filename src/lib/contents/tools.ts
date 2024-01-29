import type { JSX } from "astro/jsx-runtime";

import * as Icons from "~/components/icons";
import type { ContentsCategory } from "./contents-types";

export const tools: ContentsCategory[] = [
	{
		name: "Converters",
		description: "Convert between different formats",
		contents: [
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
		contents: [
			{
				name: "Timeline",
				description: "Create a timeline of a youtube video",
				href: "/tools/youtube/timeline",
				icon: Icons.TimelineIcon,
			},
		],
	},
	{
		name: "URL",
		description: "Url related tools",
		contents: [
			{
				name: "Shortener",
				description: "Create a Shortened url",
				href: "/tools/url/shortener",
				icon: Icons.UrlShortenerIcon,
			},
		],
	},
];
