import type { TimelineType } from "./types";
import { atom, computed } from "nanostores";
import { batch } from "solid-js";
import { createStore } from "solid-js/store";
import { getVideoId } from "~/lib/youtube";

export const $url = atom("");
export const $videoId = computed($url, (url) => getVideoId(url));
export const $prevVideoId = atom("");

export const $rememberData = atom(false);

export const $player = atom<any>();
export const $playerReady = atom(false);

export const $mainInput = atom("");

export const [timelines, setTimelines] = createStore<TimelineType[]>([]);

export const $fold = atom(false);
export const $maxRows = atom(2);

export const timelineIds = () => timelines.map((timeline) => timeline.id);
export const $lastId = atom(0);

export const formatTime = (time: [number, number, number]): string => {
  const hours = time[0] === 0 ? "" : `${time[0]}:`.padStart(0, "0");
  const minutes = `${time[1]}`.padStart(2, "0");
  const seconds = `${time[2]}`.padStart(2, "0");

  return `${hours}${minutes}:${seconds}`;
};

const secondsToTime = (seconds: number): [number, number, number] => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const remainingSeconds = Math.floor(seconds - hours * 3600 - minutes * 60);

  return [hours, minutes, remainingSeconds];
};

export const addTimeline = (text: string) => {
  if ($playerReady.get() === false || $player.get() === null) return;

  const seconds = $player.get()?.getCurrentTime() ?? 0;
  const currentTime = secondsToTime(seconds);

  const insertIndex = timelines.findIndex((timeline) => seconds < timeline.seconds);
  const timelineIndex = insertIndex === -1 ? timelines.length : insertIndex;

  $lastId.set($lastId.get() + 1);

  batch(() => {
    setTimelines(
      timelines.toSpliced(timelineIndex, 0, {
        id: $lastId.get(),
        time: currentTime,
        seconds,
        formattedTime: formatTime(currentTime),
        text,
        checked: false,
      }),
    );
    $lastId.set($lastId.get() + 1);
  });
};
