import { AiOutlineYoutube } from "solid-icons/ai";
import { TbTimelineEventText } from "solid-icons/tb";

export const TimelineIcon = () => {
  return (
    <div class="flex gap-2">
      <AiOutlineYoutube class="h-11 w-11 @[148px]:h-14 @[148px]:w-14 @[200px]:h-[4.5rem] @[200px]:w-[4.5rem]" />
      <TbTimelineEventText class="h-11 w-11 @[148px]:h-14 @[148px]:w-14 @[200px]:h-[4.5rem] @[200px]:w-[4.5rem]" />
    </div>
  );
};
