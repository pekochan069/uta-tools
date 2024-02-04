import { Either } from "effect";
import type { ContentsCategory } from "./contents-types";
import ytDlpImage from "~/assets/yt-dlp.png";

export const tldr: ContentsCategory[] = [
  {
    name: "Video",
    slug: "video",
    description: "tl;dr for video related cli tools",
    contents: [
      {
        name: "yt-dlp",
        slug: "yt-dlp",
        description: "유튜브 영상을 다운로드하는 유틸리티 프로그램",
        icon: Either.right(ytDlpImage),
      },
    ],
  },
];
