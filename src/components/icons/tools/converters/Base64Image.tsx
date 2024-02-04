import { FiImage } from "solid-icons/fi";

export const Base64ImageIcon = () => {
  return (
    <div class="flex items-center gap-1">
      <FiImage class="h-11 w-11 @[148px]:h-14 @[148px]:w-14 @[200px]:h-[4.5rem] @[200px]:w-[4.5rem]" />
      <span class="text-5xl tracking-tight @[148px]:text-6xl @[200px]:text-7xl">
        64
      </span>
    </div>
  );
};
