import { match } from "ts-pattern";
import {
  type OptionType,
  type TimeValue,
  cookies,
  format,
  time,
} from "~/atoms/tldr/video/yt-dlp";

export const toggleOption = (option: OptionType) => {
  match(option)
    .with("format", () =>
      format.set({ enabled: !format.get().enabled, value: format.get().value }),
    )
    .with("cookies", () =>
      cookies.set({
        enabled: !cookies.get().enabled,
        value: cookies.get().value,
      }),
    )
    .with("time", () =>
      time.set({ enabled: !time.get().enabled, value: time.get().value }),
    )
    .exhaustive();
};

export const formatTime = (time: TimeValue) => {
  return `${`${time.startHours}`.padStart(2, "0")}:${`${time.startMinutes}`.padStart(2, "0")}:${`${time.startSeconds}`.padStart(2, "0")}-${`${time.endHours}`.padStart(2, "0")}:${`${time.endMinutes}`.padStart(2, "0")}:${`${time.endSeconds}`.padStart(2, "0")}`;
};
