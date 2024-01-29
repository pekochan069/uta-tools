import { FiImage } from "solid-icons/fi";

export const Base64ImageIcon = () => {
	return (
		<div class="flex gap-1 items-center">
			<FiImage class="w-11 h-11 md:w-14 md:h-14" />
			<span class="text-5xl md:text-6xl tracking-tight">64</span>
		</div>
	);
};
