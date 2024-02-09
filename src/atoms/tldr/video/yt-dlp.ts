import { atom } from "nanostores";

export const command = atom<CommandType>("youtube-video");

export const link = atom("");
export const cookies = atom({
  enabled: false,
  value: "",
});
export const format = atom({
  enabled: false,
  value: "",
});
export const time = atom({
  enabled: false,
  value: {
    startHours: 0,
    startMinutes: 0,
    startSeconds: 0,
    endHours: 0,
    endMinutes: 0,
    endSeconds: 0,
  },
});

export type TimeValue = {
  startHours: number;
  startMinutes: number;
  startSeconds: number;
  endHours: number;
  endMinutes: number;
  endSeconds: number;
};

export type CommandType =
  | "youtube-video"
  | "youtube-stream"
  | "youtube-playlist"
  | "external-video";

export type YoutubeVideoOption = "format" | "cookies" | "time";
export type YoutubeStreamOption = "cookies";
export type YoutubePlaylistOption = "cookies";
export type ExternalVideoOption = "cookies";
export type OptionType =
  | YoutubeVideoOption
  | YoutubeStreamOption
  | YoutubePlaylistOption
  | ExternalVideoOption;
