import type { ContentsCategory } from "./contents-types";
import { Either } from "effect";
import * as Icons from "~/components/icons";

export const tools: ContentsCategory[] = [
  {
    name: "Converters",
    i18n: {
      ko: "변환기",
      en: "Converters",
    },
    slug: "converters",
    description: { ko: "다양한 포맷의 데이터를 전환", en: "Convert between different formats" },
    contents: [
      {
        name: "Base64",
        i18n: {
          ko: "Base64",
          en: "Base64",
        },
        slug: "base64",
        description: { ko: "Base64 인코딩/디코딩", en: "Encode/Decode base64 formatted strings" },
        icon: Either.left(Icons.Base64Icon),
      },
      {
        name: "Base64 Image",
        i18n: {
          ko: "Base64 이미지",
          en: "Base64 Image",
        },
        slug: "base64-image",
        description: {
          ko: "이미지 Base64 인코딩/디코딩",
          en: "Convert an image to a base64 encoded string",
        },
        icon: Either.left(Icons.Base64ImageIcon),
      },
      {
        name: "Hex",
        i18n: {
          ko: "16진수",
          en: "Hex",
        },
        slug: "hex",
        description: { ko: "16진수 인코딩/디코딩", en: "Encode/Decode hex values to/from strings" },
        icon: Either.left(Icons.HexIcon),
      },
      {
        name: "Cookies",
        i18n: {
          ko: "쿠키",
          en: "Cookies",
        },
        slug: "cookies",
        description: { ko: "쿠키 변환", en: "Convert cookies to other formats" },
        icon: Either.left(Icons.CookiesIcon),
      },
      {
        name: "Images",
        i18n: {
          ko: "이미지",
          en: "Images",
        },
        slug: "images",
        description: { ko: "이미지를 다른 포맷으로 변환", en: "Convert images to other formats" },
        icon: Either.left(Icons.ImagesIcon),
      },
      {
        name: "Unit",
        i18n: {
          ko: "단위",
          en: "Unit",
        },
        slug: "unit",
        description: { ko: "단위 변환", en: "Convert between different units" },
        icon: Either.left(Icons.UnitIcon),
      },
    ],
  },
  {
    name: "Youtube",
    i18n: {
      ko: "유튜브",
      en: "Youtube",
    },
    slug: "youtube",
    description: { ko: "유튜브에 관련된 도구들", en: "Youtube related tools" },
    contents: [
      {
        name: "Timeline",
        i18n: {
          ko: "타임라인",
          en: "Timeline",
        },
        slug: "timeline",
        description: {
          ko: "유튜브 영상에 대한 타임라인 작성",
          en: "Create a timeline of a youtube video",
        },
        icon: Either.left(Icons.TimelineIcon),
      },
      {
        name: "Thumbnail",
        i18n: {
          ko: "썸네일",
          en: "Thumbnail",
        },
        slug: "thumbnail",
        description: {
          ko: "유튜브 영상의 썸네일 다운로드",
          en: "Get the thumbnail of a youtube video",
        },
        icon: Either.left(Icons.ThumbnailIcon),
      },
    ],
  },
  {
    name: "URL",
    i18n: {
      ko: "URL",
      en: "URL",
    },
    slug: "url",
    description: { ko: "URL과 관련된 도구들", en: "Url related tools" },
    contents: [
      {
        name: "Shortener",
        i18n: {
          ko: "URL 단축",
          en: "Shortener",
        },
        slug: "shortener",
        description: { ko: "단축된 링크 생성", en: "Create a Shortened url" },
        icon: Either.left(Icons.UrlShortenerIcon),
      },
    ],
  },
];
