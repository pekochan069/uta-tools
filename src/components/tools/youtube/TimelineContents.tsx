import { TextField } from "@kobalte/core";
import {
	Index,
	Show,
	batch,
	createEffect,
	createSignal,
	onMount,
	untrack,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { TbCirclePlus, TbX } from "solid-icons/tb";

import {
	ToolConfig,
	ToolConfigLabel,
	ToolConfigRoot,
	ToolConfigSection,
} from "~/components/tools/common/Config";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { getVideoId } from "~/lib/youtube";
import PasteButton from "../common/PasteButton";
import { toast } from "solid-sonner";
import ClearButton from "../common/ClearButton";
import CopyButton from "../common/CopyButton";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";

type Timeline = {
	time: [number, number, number];
	formattedTime: string;
	text: string;
	checked: boolean;
};

export default () => {
	const [url, setUrl] = createSignal("");
	const videoId = () => getVideoId(url());
	const [mainInput, setMainInput] = createSignal("");
	const [timelines, setTimelines] = createStore<Timeline[]>([]);
	// biome-ignore lint/suspicious/noExplicitAny: youtube iframe
	const [player, setPlayer] = createSignal<any>();
	const [playerReady, setPlayerReady] = createSignal(false);

	const addTimeline = (text: string) => {
		if (videoId() === "" || player() === null) return;

		const currentTime = player()?.getCurrentTime()?.toString() ?? 0;

		setTimelines(
			[
				...timelines,
				{
					time: secondsToTime(currentTime),
					formattedTime: formatTime(secondsToTime(currentTime)),
					text: text,
					checked: false,
				},
			].toSorted((a, b) => {
				const aSeconds = a.time[0] * 3600 + a.time[1] * 60 + a.time[2];
				const bSeconds = b.time[0] * 3600 + b.time[1] * 60 + b.time[2];

				return aSeconds - bSeconds;
			}),
		);
	};

	const secondsToTime = (seconds: number): [number, number, number] => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds - hours * 3600) / 60);
		const remainingSeconds = Math.floor(seconds - hours * 3600 - minutes * 60);

		return [hours, minutes, remainingSeconds];
	};

	const formatTime = (time: [number, number, number]): string => {
		const hours = time[0] === 0 ? "" : `${time[0]}:`.padStart(0, "0");
		const minutes = `${time[1]}`.padStart(2, "0");
		const seconds = `${time[2]}`.padStart(2, "0");

		return `${hours}${minutes}:${seconds}`;
	};

	createEffect(() => {
		if (typeof window === "undefined") return;

		if (videoId() === "") return;

		if (untrack(playerReady)) {
			player().loadVideoById(videoId(), 0, "large");
			return;
		}

		batch(() => {
			setPlayerReady(false);
			setPlayer(
				// @ts-ignore
				new YT.Player("player", {
					videoId: videoId(),
					events: {
						// @ts-ignore
						onReady: (event) => {
							setPlayerReady(true);
							event.target.playVideo();
						},
					},
				}),
			);
		});
	});

	return (
		<div class="pb-20">
			<ToolConfigSection>
				<ToolConfigRoot>
					<ToolConfigLabel
						tool="Link"
						description="Link to a YouTube video to generate a timeline for"
					/>
					<ToolConfig>
						<TextField.Root value={url()} onChange={setUrl}>
							<TextField.Input
								type="text"
								class="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[16rem] xl:min-w-[24rem]"
							/>
						</TextField.Root>
					</ToolConfig>
				</ToolConfigRoot>
			</ToolConfigSection>
			<div class="flex justify-center mt-6 md:mt-8">
				<div class="w-full max-w-xl bg-muted rounded-md shadow-sm">
					<div class="h-0 relative pb-[56.25%] w-full">
						<Show
							when={videoId() === "" && player() !== null}
							fallback={
								<div id="player" class="top-0 left-0 w-full h-full absolute" />
							}
						>
							<div class="w-full h-full absolute grid place-content-center">
								<img src="/logo/128.png" alt="Waiting for input" />
							</div>
						</Show>
					</div>
				</div>
			</div>
			<div class="mt-6 md:mt-8">
				<div class="flex gap-4 w-full max-w-xl mx-auto">
					<TextField.Root
						value={mainInput()}
						onChange={setMainInput}
						class="flex-1"
					>
						<TextField.Input
							type="text"
							class="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</TextField.Root>
					<div class="flex gap-2">
						<Tooltip>
							<TooltipTrigger>
								<Button
									size="icon"
									variant="ghost"
									onClick={() => {
										addTimeline(mainInput());
									}}
								>
									<TbCirclePlus class="w-[1.6rem] h-[1.6rem]" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Add timeline</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger>
								<Button
									onClick={() => {
										if (timelines.length === 0) return;

										const text = timelines
											.map(
												(timeline) =>
													`${timeline.formattedTime} ${timeline.text}`,
											)
											.join("\n");

										navigator.clipboard.writeText(text);
										toast("Copied timeline to clipboard");
									}}
								>
									Copy
								</Button>
							</TooltipTrigger>
							<TooltipContent>Copy all timeline</TooltipContent>
						</Tooltip>
					</div>
				</div>
				<Table class="mt-4">
					<TableHeader>
						<TableRow>
							<TableHead class="w-4 md:w-8 py-2 pl-0 pr-4 md:p-4">
								<Checkbox
									checked={
										timelines.length > 0 &&
										timelines.every((current) => current.checked)
									}
									onChange={(checked) => {
										setTimelines(
											produce((timelines) => {
												for (const timeline of timelines) {
													timeline.checked = checked;
												}
											}),
										);
									}}
								/>
							</TableHead>
							<TableHead class="w-[4.5rem] py-2 pl-0 pr-4 md:w-[5.5rem] md:p-4">
								Time
							</TableHead>
							<TableHead class="p-2 pl-0 md:px-4">
								<div class="flex items-center">
									<div class="flex-1">Text</div>
									<div class="flex xl:gap-2">
										<CopyButton
											copyType="text"
											copyContent={timelines
												.filter((timeline) => timeline.checked)
												.map(
													(timeline) =>
														`${timeline.formattedTime} ${timeline.text}`,
												)
												.join("\n")}
											class="hover:bg-foreground active:bg-foreground hover:text-background active:text-background text-foreground"
										/>
										<Tooltip>
											<TooltipTrigger>
												<Button
													size="icon"
													variant="ghost"
													onClick={() => {
														setTimelines(
															timelines.filter((timeline) => !timeline.checked),
														);
													}}
													class="hover:bg-foreground active:bg-foreground hover:text-background active:text-background text-foreground"
												>
													<TbX class="w-[1.2rem] h-[1.2rem]" />
												</Button>
											</TooltipTrigger>
											<TooltipContent>Remove</TooltipContent>
										</Tooltip>
									</div>
								</div>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<Index each={timelines}>
							{(item, index) => (
								<TableRow>
									<TableCell class="w-4 md:w-8 py-2 pl-0 pr-4 md:p-4">
										<Checkbox
											checked={item().checked}
											onChange={() =>
												setTimelines(
													produce((timelines) => {
														timelines[index].checked =
															!timelines[index].checked;
													}),
												)
											}
										/>
									</TableCell>
									<TableCell class="w-[4.5rem] py-2 pl-0 pr-4 md:w-[5.5rem] md:p-4">
										{item().formattedTime}
									</TableCell>
									<TableCell class="p-2 pl-0 md:p-4">
										<div class="flex gap-2 md:gap-4">
											<TextField.Root class="flex-1">
												<TextField.Input
													type="text"
													value={item().text}
													onChange={(event) => {
														setTimelines(
															produce((timelines) => {
																timelines[index].text =
																	event.currentTarget.value;
															}),
														);
													}}
													class="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
												/>
											</TextField.Root>
											<div class="flex xl:gap-2">
												<ClearButton
													onClick={() =>
														setTimelines(
															produce((timelines) => {
																timelines[index].text = "";
															}),
														)
													}
													class="hidden invisible xl:flex xl:visible hover:bg-foreground active:bg-foreground hover:text-background active:text-background"
												/>
												<PasteButton
													paste={async (pasteItem) => {
														try {
															const data =
																await pasteItem.getType("text/plain");
															const textData = await data.text();
															setTimelines(
																produce((timelines) => {
																	timelines[index].text = textData;
																}),
															);
														} catch {
															toast.error("Cannot paste text from clipboard");
															return;
														}
													}}
													class="hidden invisible xl:flex xl:visible hover:bg-foreground active:bg-foreground hover:text-background active:text-background"
												/>
												<CopyButton
													copyType="text"
													copyContent={`${item().formattedTime} ${item().text}`}
													class="hidden invisible xl:flex xl:visible hover:bg-foreground active:bg-foreground hover:text-background active:text-background"
												/>
												<Tooltip>
													<TooltipTrigger>
														<Button
															size="icon"
															variant="ghost"
															onClick={() => {
																setTimelines((prev) =>
																	prev.toSpliced(index, 1),
																);
															}}
															class="hover:bg-foreground active:bg-foreground hover:text-background active:text-background"
														>
															<TbX class="w-[1.2rem] h-[1.2rem]" />
														</Button>
													</TooltipTrigger>
													<TooltipContent>Remove</TooltipContent>
												</Tooltip>
											</div>
										</div>
									</TableCell>
								</TableRow>
							)}
						</Index>
					</TableBody>
				</Table>
				<div class="grid place-content-center mt-2">
					<Tooltip>
						<TooltipTrigger>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => {
									addTimeline("");

									scroll({
										top: document.body.scrollHeight,
										behavior: "smooth",
									});
								}}
								class="h-12 w-12"
							>
								<TbCirclePlus class="w-8 h-8" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Add timeline</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};
