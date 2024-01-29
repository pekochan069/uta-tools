import { Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { TextField } from "@kobalte/core";
import { BiSolidImageAdd, BiSolidImageAlt } from "solid-icons/bi";
import { toast } from "solid-sonner";

import { Input } from "~/components/ui/input";
import CopyButton from "~/components/contents/tools/common/CopyButton";
import PasteButton from "~/components/contents/tools/common/PasteButton";
import ClearButton from "~/components/contents/tools/common/ClearButton";

export default () => {
	let imageAddIconRef: SVGSVGElement | undefined;
	let imgRef: HTMLImageElement | undefined;

	const [text, setText] = createSignal("");
	const [image, setImage] = createSignal("");
	const [file, setFile] = createSignal<File>();
	const [validImage, setValidImage] = createSignal(false);

	const textToBase64Image = (str: string) => {
		return `data:image/png;base64,${btoa(str)}`;
	};

	const windowDropEvent = (e: DragEvent) => {
		e.preventDefault();
		// if (e.dataTransfer?.files[0]) {
		// 	setFile(e.dataTransfer?.files[0].name);
		// }
	};

	onMount(() => {
		window.addEventListener("drop", windowDropEvent);
		window.addEventListener("dragover", windowDropEvent);
	});

	onCleanup(() => {
		window.removeEventListener("drop", windowDropEvent);
		window.removeEventListener("dragover", windowDropEvent);
	});

	createEffect(() => {
		setValidImage(true);
		setImage(text());
	});

	createEffect(() => {
		console.log(file()?.name);

		const reader = new FileReader();

		if (!file()) return;
		reader.readAsDataURL(file() as File);

		reader.onload = () => {
			setText(reader.result as string);
		};
	});

	return (
		<div class="flex flex-col gap-6">
			<div>
				<Input
					type="file"
					multiple
					accept="image/*"
					id="input-file"
					onInput={(e) => {
						const files = e.currentTarget.files;

						if (files?.[0]) {
							setFile(files[0]);
						}
					}}
					class="hidden"
				/>
				<label
					for="input-file"
					onDragEnter={(e) => {
						e.preventDefault();
						if (!imageAddIconRef) return;
						if (!imageAddIconRef.classList.contains("text-muted-foreground")) {
							imageAddIconRef.classList.add("text-muted-foreground");
						}
					}}
					onDragLeave={(e) => {
						e.preventDefault();
						imageAddIconRef?.classList.remove("text-muted-foreground");
					}}
					onDrop={(e) => {
						e.preventDefault();
						e.stopPropagation();
						imageAddIconRef?.classList.remove("text-muted-foreground");

						if (e.dataTransfer?.files[0]) {
							setFile(e.dataTransfer?.files[0]);
						}
					}}
					class="border-[1px] rounded-md grid place-content-center h-32 hover:cursor-pointer"
				>
					<BiSolidImageAdd ref={imageAddIconRef} class="w-16 h-16" />
				</label>
			</div>
			<div class="flex flex-col gap-2">
				<div class="mb-4">
					<div class="flex mb-2 items-end justify-between">
						<p class="text-sm font-semibold">Text</p>
						<div class="flex gap-1">
							<ClearButton
								onClick={() => {
									setText("");
								}}
							/>
							<PasteButton
								paste={async (item) => {
									try {
										const data = await item.getType("text/plain");
										const textData = await data.text();
										setText(textData);
									} catch {
										toast.error("Cannot paste text from clipboard");
										return;
									}
								}}
							/>
							<CopyButton copyType="text" copyContent={text()} />
						</div>
					</div>
					<TextField.Root
						value={text()}
						onChange={setText}
						validationState={validImage() ? "valid" : "invalid"}
					>
						<TextField.TextArea
							id="text"
							rows={8}
							placeholder="Enter text to encode/decode"
							class="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ui-not-valid:border-red-500 ui-not-valid:ring-red-300 resize-none"
						/>
						<TextField.ErrorMessage class="absolute mt-1 text-sm text-red-500">
							Invalid input
						</TextField.ErrorMessage>
					</TextField.Root>
				</div>
			</div>
			<div>
				<div class="flex mb-2 items-end justify-between">
					<p class="text-sm font-semibold">Image</p>
					<CopyButton copyType="image" copyContent={image()} />
				</div>
				<div class="aspect-video border-[1px] grid place-content-center rounded-md overflow-hidden">
					<Show when={image() !== ""} fallback={<BiSolidImageAlt class="w-16 h-16" />}>
						<img
							src={image()}
							ref={imgRef}
							alt="Decoded"
							class="w-full object-contain"
							onError={() => {
								setValidImage(false);
								imgRef?.classList.add("hidden");
							}}
							onLoad={() => {
								setValidImage(true);
								imgRef?.classList.remove("hidden");
							}}
						/>
					</Show>
				</div>
			</div>
		</div>
	);
};
