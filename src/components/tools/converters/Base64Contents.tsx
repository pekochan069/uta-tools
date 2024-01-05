import { Show, createEffect, createSignal } from "solid-js";
import { TbPlus, TbMinus } from "solid-icons/tb";
import { FaSolidArrowDown } from "solid-icons/fa";
import { IoArrowDown, IoSwapVertical } from "solid-icons/io";
import { TextField } from "@kobalte/core";

import {
	ToolConfig,
	ToolConfigLabel,
	ToolConfigRoot,
	ToolConfigSection,
} from "../common/Config";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import CopyButton from "~/components/CopyButton";

export default () => {
	const [isEncode, setIsEncode] = createSignal(true);
	const [repeat, setRepeat] = createSignal(1);
	const [input, setInput] = createSignal("");
	const [isValidInput, setIsValidInput] = createSignal(true);

	const output = () => {
		setIsValidInput(true);
		if (input() === "") {
			return "";
		}

		try {
			let out = input();
			const op = isEncode() ? btoa : atob;
			for (let i = 0; i < repeat(); i++) {
				out = op(out);
			}
			return out;
		} catch (e) {
			setIsValidInput(false);
		}
	};

	return (
		<div class="flex flex-col gap-6">
			<ToolConfigSection>
				<ToolConfigRoot>
					<ToolConfigLabel
						tool="Operation"
						description="Select whether to encode or decode the input"
					/>
					<ToolConfig>
						<label for="operation">
							<Show when={isEncode()} fallback="Decode">
								Encode
							</Show>
						</label>
						<Switch
							id="operation"
							checked={isEncode()}
							onChange={() => setIsEncode((prev) => !prev)}
						/>
					</ToolConfig>
				</ToolConfigRoot>
				<ToolConfigRoot>
					<ToolConfigLabel
						tool="Repeat"
						description="Set repeat count for operation"
					/>
					<ToolConfig>
						<Button
							variant="outline"
							onClick={() => {
								if (repeat() > 1) {
									setRepeat((prev) => prev - 1);
								}
							}}
						>
							<TbMinus />
						</Button>
						<Input
							type="number"
							min="1"
							max="9"
							readOnly
							value={repeat()}
							class="w-12 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
						/>
						<Button
							variant="outline"
							onClick={() => {
								if (repeat() < 9) {
									setRepeat((prev) => prev + 1);
								}
							}}
						>
							<TbPlus />
						</Button>
					</ToolConfig>
				</ToolConfigRoot>
			</ToolConfigSection>
			<div class="flex flex-col gap-2">
				<div class="mb-4">
					<div class="flex mb-2 items-end justify-between">
						<label for="input" class="text-sm font-semibold">
							Input
						</label>
						<CopyButton copyType="text" copyContent={input()} />
					</div>
					<TextField.Root
						value={input()}
						onChange={setInput}
						validationState={isValidInput() ? "valid" : "invalid"}
					>
						<TextField.Input
							id="input"
							placeholder="Enter text to encode/decode"
							class="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[178px] ui-not-valid:border-red-500 ui-not-valid:ring-red-300"
						/>
						<TextField.ErrorMessage class="absolute mt-1 text-sm text-red-500">
							Invalid input
						</TextField.ErrorMessage>
					</TextField.Root>
				</div>
			</div>
			<div class="grid place-content-center">
				<Button
					variant="ghost"
					class="h-full"
					onClick={() => {
						setInput(output() ?? "");
					}}
				>
					<IoSwapVertical class="w-8 h-8" />
				</Button>
			</div>
			<div>
				<div class="flex mb-2 items-end justify-between">
					<label for="output" class="text-sm font-semibold">
						Output
					</label>
					<CopyButton copyType="text" copyContent={output()} />
				</div>
				<TextField.Root value={output()}>
					<TextField.Input
						readOnly
						id="output"
						placeholder="Output will appear here"
						class="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[178px]"
						onFocus={(e) => e.target.select()}
					/>
				</TextField.Root>
			</div>
		</div>
	);
};
