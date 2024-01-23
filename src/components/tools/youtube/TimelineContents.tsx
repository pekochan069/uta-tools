import { TextField } from "@kobalte/core";
import {
	Index,
	Show,
	batch,
	createEffect,
	createSignal,
	untrack,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { TbCirclePlus, TbDotsVertical, TbX } from "solid-icons/tb";
import { toast } from "solid-sonner";

import { getVideoId } from "~/lib/youtube";
import {
	ToolConfig,
	ToolConfigLabel,
	ToolConfigRoot,
	ToolConfigSection,
} from "~/components/tools/common/Config";
import PasteButton from "../common/PasteButton";
import ClearButton from "../common/ClearButton";
import CopyButton from "../common/CopyButton";
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";

type Timeline = {
	time: [number, number, number];
	seconds: number;
	formattedTime: string;
	text: string;
	checked: boolean;
};

export default () => {
	const [url, setUrl] = createSignal("");
	const videoId = () => getVideoId(url());
	const [prevVideoId, setPrevVideoId] = createSignal("");
	const [mainInput, setMainInput] = createSignal("");
	const [timelines, setTimelines] = createStore<Timeline[]>([]);
	// biome-ignore lint/suspicious/noExplicitAny: youtube iframe
	const [player, setPlayer] = createSignal<any>();
	const [playerReady, setPlayerReady] = createSignal(false);

	const addTimeline = (text: string) => {
		if (videoId() === "" || player() === null) return;

		const seconds = player()?.getCurrentTime() ?? 0;
		const currentTime = secondsToTime(seconds);

		const insertIndex = timelines.findIndex(
			(timeline) => seconds < timeline.seconds,
		);
		const timelineIndex = insertIndex === -1 ? timelines.length : insertIndex;

		setTimelines(
			timelines.toSpliced(timelineIndex, 0, {
				time: currentTime,
				seconds,
				formattedTime: formatTime(currentTime),
				text,
				checked: false,
			}),
		);
	};

	const changeTime = (
		type: "hour" | "minute" | "second",
		index: number,
		value: number,
	) => {
		if (timelines.length === 0) return;

		let time = timelines[index].time;

		switch (type) {
			case "hour":
				time = [value, time[1], time[2]];
				break;
			case "minute":
				time = [time[0], value, time[2]];
				break;
			case "second":
				time = [time[0], time[1], value];
				break;
		}

		setTimelines(
			produce((timelines) => {
				timelines[index] = {
					...timelines[index],
					time: time,
					seconds: time[0] * 3600 + time[1] * 60 + time[2],
					formattedTime: formatTime(time),
				};
			}),
		);
	};

	const sortTimelines = () => {
		setTimelines(
			timelines.toSorted((a, b) => {
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

		if (videoId() === prevVideoId()) return;

		if (untrack(playerReady)) {
			batch(() => {
				player().loadVideoById(videoId(), 0, "large");
				setPrevVideoId(videoId());
			});

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
							batch(() => {
								setPrevVideoId(videoId());
								setPlayerReady(true);
							});

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
							when={
								playerReady() === false && videoId() === "" && player() !== null
							}
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
				<div class="flex gap-4 w-full max-w-xl mx-auto flex-col md:flex-row">
					<div class="flex flex-1 gap-2">
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
						<Tooltip>
							<TooltipTrigger>
								<Button
									size="icon"
									variant="ghost"
									onClick={() => {
										batch(() => {
											addTimeline(mainInput());
											setMainInput("");
										});
									}}
								>
									<TbCirclePlus class="w-[1.6rem] h-[1.6rem]" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Add timeline</TooltipContent>
						</Tooltip>
					</div>
					<div class="flex justify-end">
						<div class="grid grid-cols-2 gap-2">
							<Button
								onClick={() => {
									if (timelines.length === 0) return;

									sortTimelines();
								}}
							>
								Sort
							</Button>
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
				</div>
			</div>
			<Table class="mt-4">
				<TableHeader>
					<TableRow>
						<TableHead class="w-4 md:w-8 py-2 pl-0 pr-4 md:p-4 hidden invisible sm:table-cell sm:visible">
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
						<TableHead class="w-[5.5rem] py-2 sm:pl-0 pr-4 md:p-4">
							Time
						</TableHead>
						<TableHead class="p-2 pl-0 md:px-4">
							<div class="flex items-center">
								<div class="flex-1">Text</div>
								<div class="hidden invisible sm:flex sm:visible xl:gap-2">
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
						<TableHead class="w-6 md:w-8 p-0" />
					</TableRow>
				</TableHeader>
				<TableBody>
					<Index each={timelines}>
						{(item, index) => (
							<TableRow>
								<TableCell class="w-4 md:w-8 py-2 pl-0 pr-4 md:p-4 hidden invisible sm:table-cell sm:visible">
									<Checkbox
										checked={item().checked}
										onChange={() =>
											setTimelines(
												produce((timelines) => {
													timelines[index].checked = !timelines[index].checked;
												}),
											)
										}
									/>
								</TableCell>
								<TableCell class="w-[5.5rem] py-2 sm:pl-0 pr-4 md:p-4">
									<Popover>
										<PopoverTrigger>{item().formattedTime}</PopoverTrigger>
										<PopoverContent>
											<div class="grid grid-cols-3 gap-2">
												<TextField.Root
													value={item().time[0].toString()}
													onChange={(value) => {
														if (Number.isNaN(value)) return;

														const hours = parseInt(value) ?? item().time[0];

														if (hours < 0 || hours > 99) return;
														if (hours === item().time[0]) return;

														changeTime("hour", index, hours);
													}}
												>
													<TextField.Label class="text-sm">
														Hour
													</TextField.Label>
													<TextField.Input
														type="number"
														min={0}
														max={99}
														class="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
													/>
												</TextField.Root>
												<TextField.Root
													value={item().time[1].toString()}
													onChange={(value) => {
														if (Number.isNaN(value)) return;

														const minutes = parseInt(value) ?? item().time[1];

														if (minutes < 0 || minutes > 59) return;
														if (minutes === item().time[1]) return;

														changeTime("minute", index, minutes);
													}}
												>
													<TextField.Label class="text-sm">
														Minutes
													</TextField.Label>
													<TextField.Input
														type="number"
														min={0}
														max={59}
														class="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
													/>
												</TextField.Root>
												<TextField.Root
													value={item().time[2].toString()}
													onChange={(value) => {
														if (Number.isNaN(value)) return;

														const seconds = parseInt(value) ?? item().time[2];

														if (seconds < 0 || seconds > 59) return;
														if (seconds === item().time[2]) return;

														changeTime("second", index, seconds);
													}}
												>
													<TextField.Label class="text-sm mb-1">
														Seconds
													</TextField.Label>
													<TextField.Input
														type="number"
														min={0}
														max={59}
														class="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
													/>
												</TextField.Root>
											</div>
										</PopoverContent>
									</Popover>
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
															timelines[index].text = event.currentTarget.value;
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
														const data = await pasteItem.getType("text/plain");
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
															setTimelines((prev) => prev.toSpliced(index, 1));
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
								<TableCell class="w-6 md:w-8 p-0">
									<div class="grid place-content-center">
										<TbDotsVertical class="w-6 h-6 text-muted" />
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
					<TooltipContent>Add empty timeline</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
};
