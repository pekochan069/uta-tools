import {
  For,
  Index,
  Show,
  batch,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  untrack,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { BsPersonWorkspace } from "solid-icons/bs";
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
  ContentConfig,
  ContentConfigLabel,
  ContentConfigRoot,
  ContentConfigSection,
} from "~/components/common/Config";
import CopyButton from "~/components/common/CopyButton";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Input } from "~/components/ui/input";

import type { TimelineType } from "./timelineTypes";
import TimelineRow from "./TimelineRow";

const FoldButton = (props: {
  fold: boolean;
  setFold: (value: boolean) => void;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            props.setFold(!props.fold);
          }}
          data-fold={props.fold ? "fold" : "unfold"}
          class="text-foreground hover:bg-foreground hover:text-background active:bg-foreground active:text-background data-[fold=fold]:bg-destructive data-[fold=fold]:text-destructive-foreground"
        >
          <TbDotsVertical class="h-[1.2rem] w-[1.2rem]" />
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
  const [onMobile, setOnMobile] = createSignal(false);

  const timelineIds = () => timelines.map((item) => item.id);

  const addTimeline = (text: string) => {
    if (playerReady() === false || player() === null) return;

    const seconds = player()?.getCurrentTime() ?? 0;
    const currentTime = secondsToTime(seconds);

    const insertIndex = timelines.findIndex(
      (timeline) => seconds < timeline.seconds,
    );
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

  const changeTime = (
    type: "hour" | "minute" | "second",
    id: number,
    value: string,
  ) => {
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
        timeline.seconds =
          formattedTime[0] * 3600 + formattedTime[1] * 60 + formattedTime[2];
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
      tableBodyRef.getBoundingClientRect().top +
      document.documentElement.scrollTop;
    const playerContainerStart =
      playerContainerRef.getBoundingClientRect().top +
      document.documentElement.scrollTop;
    const rowHeight = window.innerWidth < 768 ? 56.5 : 72.5;

    const newMaxRows =
      Math.floor(
        (window.innerHeight - (tableBodyStart - playerContainerStart + 16)) /
          rowHeight,
      ) - 1;

    setMaxRows(newMaxRows < 2 ? 2 : newMaxRows);
  };

  const scrollToWorkingArea = () => {
    if (playerContainerRef === undefined) return;

    const playerContainerStart =
      playerContainerRef.getBoundingClientRect().top +
      document.documentElement.scrollTop;

    window.scroll({
      top: playerContainerStart - 16,
      behavior: "smooth",
    });
  };

  const onWindowScroll = () => {
    const width = window.innerWidth;

    if (width < 768 && onMobile()) {
      return;
    }

    calculateMaxRows();

    if (width < 768 && !onMobile()) {
      setOnMobile(true);
    }

    if (width >= 768 && onMobile()) {
      setOnMobile(false);
    }
  };

  onMount(() => {
    calculateMaxRows();
    window.addEventListener("resize", onWindowScroll);
  });

  onCleanup(() => {
    window.removeEventListener("resize", onWindowScroll);
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
      <ContentConfigSection>
        <ContentConfigRoot>
          <ContentConfigLabel
            name="Link"
            description="Link to a YouTube video to generate a timeline for"
          />
          <ContentConfig>
            <Input
              value={url()}
              onChange={setUrl}
              type="text"
              placeholder="http://youtu.be/{videoId}"
              class=" min-w-[16rem] xl:min-w-[24rem]"
            />
          </ContentConfig>
        </ContentConfigRoot>
      </ContentConfigSection>
      <div class="min-h-[100svh]">
        <div class="mt-6 flex justify-center md:mt-8">
          <div
            ref={playerContainerRef}
            class="w-full max-w-xl rounded-md bg-muted shadow-sm"
          >
            <div class="relative h-0 w-full pb-[56.25%]">
              <Show
                when={
                  playerReady() === false &&
                  videoId() === "" &&
                  player() !== null
                }
                fallback={
                  <div
                    id="player"
                    class="absolute left-0 top-0 h-full w-full"
                  />
                }
              >
                <div class="absolute grid h-full w-full place-content-center">
                  <img src="/logo/128.png" alt="Waiting for input" />
                </div>
              </Show>
            </div>
          </div>
        </div>
        <div class="mt-6 md:mt-8">
          <div class="mx-auto flex w-full max-w-xl flex-col gap-4 md:flex-row">
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
                      <TbCirclePlus class="h-[1.6rem] w-[1.6rem]" />
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
                          .map(
                            (timeline) =>
                              `${timeline.formattedTime} ${timeline.text}`,
                          )
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
              <TableHead class="w-4 py-2 pl-0 pr-4 md:w-8 md:p-4">
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
              <TableHead class="w-[5.5rem] py-2 pr-4 sm:pl-0 md:p-4">
                Time
              </TableHead>
              <TableHead class="p-2 pl-0 md:px-4">
                <div class="flex items-center">
                  <div class="flex-1">Text</div>
                  <div class="flex-0 flex gap-1 sm:gap-2">
                    <div class="sm:invisible sm:hidden">
                      <FoldButton
                        fold={fold()}
                        setFold={(value) => setFold(value)}
                      />
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => scrollToWorkingArea()}
                          class="text-foreground hover:bg-foreground hover:text-background active:bg-foreground active:text-background"
                        >
                          <BsPersonWorkspace class="h-[1.2rem] w-[1.2rem]" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Scroll to Workspace</TooltipContent>
                    </Tooltip>
                    <div class="invisible hidden sm:visible sm:block">
                      <CopyButton
                        copyType="text"
                        copyContent={timelines
                          .filter((timeline) => timeline.checked)
                          .map(
                            (timeline) =>
                              `${timeline.formattedTime} ${timeline.text}`,
                          )
                          .join("\n")}
                        tooltip="Copy selected"
                        class="text-foreground hover:bg-foreground hover:text-background active:bg-foreground active:text-background"
                      />
                    </div>
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
                          class="text-foreground hover:bg-foreground hover:text-background active:bg-foreground active:text-background"
                        >
                          <TbX class="h-[1.2rem] w-[1.2rem]" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Remove Selected</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </TableHead>
              <TableHead class="invisible hidden w-6 px-2 sm:visible sm:table-cell md:w-8">
                <FoldButton fold={fold()} setFold={(value) => setFold(value)} />
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
                  each={
                    fold()
                      ? timelines.toSpliced(0, timelines.length - maxRows())
                      : timelines
                  }
                >
                  {(item, index) => (
                    <TimelineRow
                      item={item}
                      fold={fold()}
                      onTimeChange={(type, value) =>
                        changeTime(type, item.id, value)
                      }
                      deleteTimeline={() =>
                        setTimelines((prev) => prev.toSpliced(index(), 1))
                      }
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
                          <div class="flex h-12 w-full items-center justify-center rounded-md bg-foreground shadow-lg">
                            <div class="font-semibold text-background">
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
        <div class="mt-2 flex justify-center gap-4">
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="icon"
                variant="ghost"
                class="h-12 w-12"
                onClick={() => scrollToWorkingArea()}
              >
                <BsPersonWorkspace class="h-8 w-8" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Scroll to Workspace</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  addTimeline("");

                  if (!fold()) {
                    if (timelines.length > maxRows()) {
                      scroll({
                        top: document.body.scrollHeight,
                        behavior: "smooth",
                      });
                    }
                  }
                }}
                class="h-12 w-12"
              >
                <TbCirclePlus class="h-8 w-8" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add empty timeline</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
