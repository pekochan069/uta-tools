import type { JSX } from "astro/jsx-runtime";

import type { ContentsCategory } from "./contents-types";
import * as Icons from "~/components/icons";

export const tldr: ContentsCategory[] = [
	{
		name: "Video",
		description: "tl;dr for video related cli tools",
		contents: [
			{
				name: "yt-dlp",
				description: "download videos from youtube",
				href: "/tldr/video/yt-dlp",
				icon: Icons.YtDlpIcon,
			},
		],
	},
];
