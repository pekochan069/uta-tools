import { atom, computed } from "nanostores";
import { getVideoId } from "~/lib/youtube";

export const url = atom("")
export const videoId = atom("")