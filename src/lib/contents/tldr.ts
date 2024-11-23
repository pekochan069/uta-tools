import type { ContentsCategory } from "./contents-types";
import { Either } from "effect";

export const tldr: ContentsCategory[] = [
  {
    name: "Video",
    i18n: {
      ko: "비디오",
      en: "Video",
    },
    slug: "video",
    description: { ko: "영상과 관련된 cli 도구들 요약", en: "tl;dr for video related cli tools" },
    contents: [
      {
        name: "yt-dlp",
        i18n: {
          ko: "yt-dlp",
          en: "yt-dlp",
        },
        slug: "yt-dlp",
        description: {
          ko: "유튜브 영상을 다운로드하는 유틸리티 프로그램",
          en: "A utility program for downloading YouTube videos",
        },
        icon: Either.right("/icon/yt-dlp.png"),
      },
    ],
  },
];
