import { TbArrowDown } from "solid-icons/tb";

export function ImagesIcon() {
  return (
    <div class="flex flex-col items-center gap-1 text-xl font-bold">
      <span>PNG</span>
      <TbArrowDown class="size-6" />
      <span>WebP</span>
    </div>
  );
}
