import * as Icons from "~/components/icons";
import type { ContentsCategory } from "./contents-types";
import { Either } from "effect";

export const tools: ContentsCategory[] = [
  {
    name: "Converters",
    slug: "converters",
    description: "Convert between different formats",
    contents: [
      {
        name: "Base64",
        slug: "base64",
        description: "Encode/Decode base64 formatted strings",
        icon: Either.left(Icons.Base64Icon),
      },
      {
        name: "Base64 Image",
        slug: "base64-image",
        description: "Convert an image to a base64 encoded string",
        icon: Either.left(Icons.Base64ImageIcon),
      },
      {
        name: "Hex",
        slug: "hex",
        description: "Encode/Decode hex values to/from strings",
        icon: Either.left(Icons.HexIcon),
      },
    ],
  },
  {
    name: "Youtube",
    slug: "youtube",
    description: "Youtube related tools",
    contents: [
      {
        name: "Timeline",
        slug: "timeline",
        description: "Create a timeline of a youtube video",
        icon: Either.left(Icons.TimelineIcon),
      },
    ],
  },
  {
    name: "URL",
    slug: "url",
    description: "Url related tools",
    contents: [
      {
        name: "Shortener",
        slug: "shortener",
        description: "Create a Shortened url",
        icon: Either.left(Icons.UrlShortenerIcon),
      },
    ],
  },
];
