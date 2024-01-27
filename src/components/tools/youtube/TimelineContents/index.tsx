import {
	For,
	Index,
	Show,
	batch,
	createEffect,
	createSignal,
	on,
	onCleanup,
	onMount,
	untrack,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { TbCirclePlus, TbDotsVertical, TbX } from "solid-icons/tb";
import { toast } from "solid-sonner";
import {
	DragDropProvider,
	DragDropSensors,
	DragOverlay,
	SortableProvider,
	closestCenter,
	type Id,
} from "@thisbeyond/solid-dnd";

import { checkUrl, getVideoId } from "~/lib/youtube";
import {
	ToolConfig,
	ToolConfigLabel,
	ToolConfigRoot,
	ToolConfigSection,
} from "~/components/tools/common/Config";
import CopyButton from "~/components/tools/common/CopyButton";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { Input } from "~/components/ui/input";

import type { TimelineType } from "./timelineTypes";
import TimelineRow from "./TimelineRow";

const FoldButton = (props: {
	fold: boolean;
	setFold: (value: boolean) => void;
	scrollToWorkingArea: () => void;
}) => {
	return (
		<Tooltip>
			<TooltipTrigger>
				<Button
					size="icon"
					variant="ghost"
					onClick={() => {
						if (!props.fold) {
							props.scrollToWorkingArea();
						}

						props.setFold(!props.fold);
					}}
					data-fold={props.fold ? "fold" : "unfold"}
					class="hover:bg-foreground active:bg-foreground hover:text-background active:text-background text-foreground data-[fold=fold]:bg-destructive data-[fold=fold]:text-destructive-foreground"
				>
					<TbDotsVertical class="w-[1.2rem] h-[1.2rem]" />
				</Button>
			</TooltipTrigger>
			<TooltipContent>{props.fold ? "More" : "Fold"}</TooltipContent>
		</Tooltip>
	);
};

export default () => {
	let tableBodyRef: HTMLTableSectionElement | undefined;
	let playerContainerRef: HTMLDivElement | undefined;

	const [url, setUrl] = createSignal("");
	const videoId = () => getVideoId(url());
	const [prevVideoId, setPrevVideoId] = createSignal("");
	const [mainInput, setMainInput] = createSignal("");
	const [lastId, setLastId] = createSignal(1);
	const [timelines, setTimelines] = createStore<TimelineType[]>([]);
	// biome-ignore lint/suspicious/noExplicitAny: youtube iframe
	const [player, setPlayer] = createSignal<any>();
	const [playerReady, setPlayerReady] = createSignal(false);
	const [activeId, setActiveId] = createSignal<Id | null>(null);
	const [fold, setFold] = createSignal(false);
	const [maxRows, setMaxRows] = createSignal(2);

	const timelineIds = () => timelines.map((item) => item.id);

	const addTimeline = (text: string) => {
		if (playerReady() === false || player() === null) return;

		const seconds = player()?.getCurrentTime() ?? 0;
		const currentTime = secondsToTime(seconds);

		const insertIndex = timelines.findIndex((timeline) => seconds < timeline.seconds);
		const timelineIndex = insertIndex === -1 ? timelines.length : insertIndex;

		batch(() => {
			setTimelines(
				timelines.toSpliced(timelineIndex, 0, {
					id: lastId(),
					time: currentTime,
					seconds,
					formattedTime: formatTime(currentTime),
					text,
					checked: false,
				}),
			);
			setLastId((prev) => prev + 1);
		});
	};

	const changeTime = (type: "hour" | "minute" | "second", id: number, value: string) => {
		if (timelines.length === 0) return;

		const parsedValue = parseInt(value);

		const timeline = timelines.find((timeline) => timeline.id === id);

		if (timeline === undefined) return;

		let time = timeline.time;
		const formattedValue = Number.isNaN(parsedValue) ? 0 : parsedValue;
		let formattedTime = time;

		switch (type) {
			case "hour":
				if (parsedValue < 0 || parsedValue > 99) return;
				if (parsedValue === time[0]) return;

				time = [parsedValue, time[1], time[2]];
				formattedTime = [formattedValue, time[1], time[2]];
				break;
			case "minute":
				if (parsedValue < 0 || parsedValue > 59) return;
				if (parsedValue === time[1]) return;

				time = [time[0], parsedValue, time[2]];
				formattedTime = [time[0], formattedValue, time[2]];
				break;
			case "second":
				if (parsedValue < 0 || parsedValue > 59) return;
				if (parsedValue === time[2]) return;

				time = [time[0], time[1], parsedValue];
				formattedTime = [time[0], time[1], formattedValue];
				break;
		}

		setTimelines(
			(timeline) => timeline.id === id,
			produce((timeline) => {
				timeline.time = time;
				timeline.formattedTime = formatTime(formattedTime);
				timeline.seconds = formattedTime[0] * 3600 + formattedTime[1] * 60 + formattedTime[2];
			}),
		);
	};

	const sortTimelines = () => {
		if (timelines.length === 0) return;

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

	const calculateMaxRows = () => {
		if (tableBodyRef === undefined || playerContainerRef === undefined) return;

		const tableBodyStart =
			tableBodyRef.getBoundingClientRect().top + document.documentElement.scrollTop;
		const playerContainerStart =
			playerContainerRef.getBoundingClientRect().top + document.documentElement.scrollTop;
		const rowHeight = window.innerWidth < 768 ? 56.5 : 72.5;

		const newMaxRows =
			Math.floor((window.innerHeight - (tableBodyStart - playerContainerStart + 16)) / rowHeight) -
			1;

		setMaxRows(newMaxRows < 2 ? 2 : newMaxRows);
	};

	const scrollToWorkingArea = () => {
		if (playerContainerRef === undefined) return;

		const playerContainerStart =
			playerContainerRef.getBoundingClientRect().top + document.documentElement.scrollTop;

		window.scroll({
			top: playerContainerStart - 16,
			behavior: "smooth",
		});
	};

	onMount(() => {
		calculateMaxRows();
		window.addEventListener("resize", calculateMaxRows);
	});

	onCleanup(() => {
		window.removeEventListener("resize", calculateMaxRows);
	});

	createEffect(() => {
		if (typeof window === "undefined") return;

		if (videoId() === "" || videoId() === prevVideoId()) return;

		if (untrack(playerReady)) {
			batch(() => {
				player().loadVideoById(videoId(), 0, "large");
				setPrevVideoId(videoId());
				scrollToWorkingArea();
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
							scrollToWorkingArea();
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
						<Input
							value={url()}
							onChange={setUrl}
							type="text"
							placeholder="http://youtu.be/{videoId}"
							class=" min-w-[16rem] xl:min-w-[24rem]"
						/>
					</ToolConfig>
				</ToolConfigRoot>
			</ToolConfigSection>
			<div class="min-h-[100svh]">
				<div class="flex justify-center mt-6 md:mt-8">
					<div ref={playerContainerRef} class="w-full max-w-xl bg-muted rounded-md shadow-sm">
						<div class="h-0 relative pb-[56.25%] w-full">
							<Show
								when={playerReady() === false && videoId() === "" && player() !== null}
								fallback={<div id="player" class="top-0 left-0 w-full h-full absolute" />}
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
						<form
							onSubmit={(event) => {
								event.preventDefault();

								batch(() => {
									addTimeline(mainInput());
									setMainInput("");
								});
							}}
							class="flex-1"
						>
							<div class="flex gap-2">
								<Input
									value={mainInput()}
									onChange={(value) => {
										if (player() === undefined) {
											if (checkUrl(value)) {
												setUrl(value);
											}

											return;
										}

										setMainInput(value);
									}}
									placeholder="Ado / Show"
									rootClass="flex-1"
								/>
								<Tooltip>
									<TooltipTrigger>
										<Button size="icon" variant="ghost">
											<TbCirclePlus class="w-[1.6rem] h-[1.6rem]" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>Add timeline</TooltipContent>
								</Tooltip>
							</div>
						</form>
						<div class="flex justify-end">
							<div class="grid grid-cols-2 gap-2">
								<Button onClick={() => sortTimelines()} class="font-semibold">
									Sort
								</Button>
								<Tooltip>
									<TooltipTrigger>
										<Button
											onClick={() => {
												if (timelines.length === 0) return;

												const text = timelines
													.map((timeline) => `${timeline.formattedTime} ${timeline.text}`)
													.join("\n");

												navigator.clipboard.writeText(text);
												toast("Copied timeline to clipboard");
											}}
											class="font-semibold"
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
				<Table class="mt-4 overflow-hidden">
					<TableHeader>
						<TableRow>
							<TableHead class="w-4 md:w-8 py-2 pl-0 pr-4 md:p-4 hidden invisible sm:table-cell sm:visible">
								<Checkbox
									checked={timelines.length > 0 && timelines.every((current) => current.checked)}
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
							<TableHead class="w-[5.5rem] py-2 sm:pl-0 pr-4 md:p-4">Time</TableHead>
							<TableHead class="p-2 pl-0 md:px-4">
								<div class="flex items-center">
									<div class="flex-1">Text</div>
									<div class="sm:invisible sm:hidden">
										<FoldButton
											fold={fold()}
											setFold={(value) => setFold(value)}
											scrollToWorkingArea={scrollToWorkingArea}
										/>
									</div>
									<div class="hidden invisible sm:flex sm:visible xl:gap-2">
										<CopyButton
											copyType="text"
											copyContent={timelines
												.filter((timeline) => timeline.checked)
												.map((timeline) => `${timeline.formattedTime} ${timeline.text}`)
												.join("\n")}
											class="hover:bg-foreground active:bg-foreground hover:text-background active:text-background text-foreground"
										/>
										<Tooltip>
											<TooltipTrigger>
												<Button
													size="icon"
													variant="ghost"
													onClick={() => {
														setTimelines(timelines.filter((timeline) => !timeline.checked));
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
							<TableHead class="w-6 md:w-8 px-2 hidden invisible sm:table-cell sm:visible">
								<FoldButton
									fold={fold()}
									setFold={(value) => setFold(value)}
									scrollToWorkingArea={scrollToWorkingArea}
								/>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody ref={tableBodyRef} class="overflow-hidden">
						<DragDropProvider
							collisionDetector={closestCenter}
							onDragStart={({ draggable }) => {
								setActiveId(draggable.id);
							}}
							onDragEnd={({ draggable, droppable }) => {
								if (draggable && droppable) {
									const currentItems = timelineIds();
									const from = currentItems.indexOf(draggable.id as number);
									const to = currentItems.indexOf(droppable.id as number);
									if (from !== to) {
										setTimelines(
											produce((timelines) => {
												const [removed] = timelines.splice(from, 1);
												timelines.splice(to, 0, removed);
											}),
										);
									}
								}
								setActiveId(null);
							}}
						>
							<DragDropSensors />
							<SortableProvider ids={timelineIds()}>
								<For
									each={fold() ? timelines.toSpliced(0, timelines.length - maxRows()) : timelines}
								>
									{(item, index) => (
										<TimelineRow
											item={item}
											fold={fold()}
											onTimeChange={(type, value) => changeTime(type, item.id, value)}
											deleteTimeline={() => setTimelines((prev) => prev.toSpliced(index(), 1))}
											setChecked={(checked) =>
												setTimelines(
													(timeline) => timeline.id === item.id,
													produce((timeline) => {
														timeline.checked = checked;
													}),
												)
											}
											onTimelineChange={(value) =>
												setTimelines(
													(timeline) => timeline.id === item.id,
													produce((timeline) => {
														timeline.text = value;
													}),
												)
											}
										/>
									)}
								</For>
							</SortableProvider>
							<DragOverlay>
								{activeId() !== null && (
									<Index each={timelines}>
										{(timeline) => {
											if (timeline().id === activeId()) {
												return (
													<div class="w-full h-12 bg-foreground rounded-md shadow-lg flex items-center justify-center">
														<div class="text-background font-semibold">
															{timeline().formattedTime}
														</div>
													</div>
												);
											}
										}}
									</Index>
								)}
							</DragOverlay>
						</DragDropProvider>
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

									if (!fold()) {
										if (timelines.length > maxRows()) {
											setFold(true);
										} else {
											scroll({
												top: document.body.scrollHeight,
												behavior: "smooth",
											});
										}
									}
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
		</div>
	);
};
