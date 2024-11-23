import { AiOutlineYoutube } from "solid-icons/ai";
import { FaRegularImages } from "solid-icons/fa";

export const ThumbnailIcon = () => {
  return (
    <div class="flex gap-2">
      <AiOutlineYoutube class="h-11 w-11 @[148px]:h-14 @[148px]:w-14 @[200px]:h-[4.5rem] @[200px]:w-[4.5rem]" />
      <FaRegularImages class="h-11 w-11 @[148px]:h-14 @[148px]:w-14 @[200px]:h-[4.5rem] @[200px]:w-[4.5rem]" />
    </div>
  );
};
