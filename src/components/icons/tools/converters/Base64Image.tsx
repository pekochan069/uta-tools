import { FiImage } from "solid-icons/fi";

export const Base64ImageIcon = () => {
	return (
		<div class="flex gap-1 items-center">
			<FiImage class="w-11 h-11 @[148px]:w-14 @[148px]:h-14 @[200px]:w-[4.5rem] @[200px]:h-[4.5rem]" />
			<span class="text-5xl @[148px]:text-6xl tracking-tight @[200px]:text-7xl">64</span>
		</div>
	);
};
