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
        description: "유튜브 영상을 다운로드하는 유틸리티 프로그램",
        href: "/tldr/video/yt-dlp",
        icon: Icons.YtDlpIcon,
      },
    ],
  },
];
