import { AiOutlineYoutube } from "solid-icons/ai";
import { TbTimelineEventText } from "solid-icons/tb";

export const TimelineIcon = () => {
	return (
		<div class="flex gap-2">
			<AiOutlineYoutube class="w-11 h-11 md:w-14 md:h-14" />
			<TbTimelineEventText class="w-11 h-11 md:w-14 md:h-14" />
		</div>
	);
};
