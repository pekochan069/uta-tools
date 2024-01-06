import { Show, createEffect, createSignal } from "solid-js";
import { type UploadFile, createDropzone } from "@solid-primitives/upload";
import { TextField } from "@kobalte/core";
import { BiSolidImageAdd, BiSolidImageAlt } from "solid-icons/bi";
import { toast } from "solid-sonner";

import {
	ToolConfig,
	ToolConfigLabel,
	ToolConfigRoot,
	ToolConfigSection,
} from "~/components/tools/common/Config";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import CopyButton from "~/components/tools/common/CopyButton";
import PasteButton from "~/components/tools/common/PasteButton";
import ClearButton from "~/components/tools/common/ClearButton";
import { set } from "astro/zod";

export default () => {
	let imageAddIconRef: SVGSVGElement | undefined;
	let imgRef: HTMLImageElement | undefined;

	const [text, setText] = createSignal("");
	const [image, setImage] = createSignal("");
	const [validImage, setValidImage] = createSignal(false);
	const { setRef: dropzoneRef, files: droppedFiles } = createDropzone({
		onDrop: (files) => {
			const reader = new FileReader();
			const droppedImage = files[0].file;
			reader.readAsDataURL(droppedImage);

			reader.onload = () => {
				setText(reader.result as string);
			};

			if (!imageAddIconRef) return;
			if (imageAddIconRef.classList.contains("text-muted-foreground")) {
				imageAddIconRef.classList.remove("text-muted-foreground");
			}
		},
		onDragEnter: () => {
			if (!imageAddIconRef) return;
			if (!imageAddIconRef.classList.contains("text-muted-foreground")) {
				imageAddIconRef.classList.add("text-muted-foreground");
			}
		},
		onDragLeave: () => {
			if (!imageAddIconRef) return;
			if (imageAddIconRef.classList.contains("text-muted-foreground")) {
				imageAddIconRef.classList.remove("text-muted-foreground");
			}
		},
	});

	const textToBase64Image = (str: string) => {
		return `data:image/png;base64,${btoa(str)}`;
	};

	createEffect(() => {
		setValidImage(true);
		setImage(text());
	});

	return (
		<div class="flex flex-col gap-6">
			<div>
				<div
					ref={dropzoneRef}
					class="border-[1px] rounded-md grid place-content-center h-32"
				>
					<div
						id="drop-1"
						class="flex flex-col gap-y-2 justify-center items-center"
					>
						<BiSolidImageAdd ref={imageAddIconRef} class="w-16 h-16" />
					</div>
				</div>
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
					{/* <CopyButton copyType="text" copyContent={output()} /> */}
				</div>
				<div class="aspect-video border-[1px] grid place-content-center rounded-md overflow-hidden">
					<Show
						when={image() !== ""}
						fallback={<BiSolidImageAlt class="w-16 h-16" />}
					>
						<img
							src={image()}
							ref={imgRef}
							alt="Decoded"
							class="w-full object-contain"
							onError={() => {
								setValidImage(false);
							}}
						/>
					</Show>
				</div>
			</div>
		</div>
	);
};
