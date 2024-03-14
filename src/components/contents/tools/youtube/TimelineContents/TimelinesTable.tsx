import { useStore } from "@nanostores/solid";
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  type Id,
  SortableProvider,
  closestCenter,
} from "@thisbeyond/solid-dnd";
import { BsPersonWorkspace } from "solid-icons/bs";
import { TbX } from "solid-icons/tb";
import { For, Index, batch, createSignal, onMount } from "solid-js";
import { produce } from "solid-js/store";

import CopyButton from "~/components/common/CopyButton";
import { YoutubeLink } from "~/components/contents/tldr/video/yt-dlp/YoutubeLink";
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
import FoldButton from "./FoldButton";
import { scrollToWorkspace } from "./ScrollToWorkspace";
import TimelineRow from "./TimelineRow";
import {
  url,
  fold,
  formatTime,
  maxRows,
  setTimelines,
  timelineIds,
  timelines,
} from "./timelineAtoms";

export default () => {
  let tableBodyRef: HTMLTableSectionElement | undefined;
  const playerContainerRef = document.getElementById("player-container");

  const [activeId, setActiveId] = createSignal<Id | null>(null);
  // const [maxRows, setMaxRows] = createSignal(5);
  const [onMobile, setOnMobile] = createSignal(false);

  const $url = useStore(url);
  const $fold = useStore(fold);
  const $maxRows = useStore(maxRows);

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

  const calculateMaxRows = () => {
    if (tableBodyRef === undefined || playerContainerRef === null) return;

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

    maxRows.set(newMaxRows < 2 ? 2 : newMaxRows);
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
    batch(() => {
      const useData = localStorage.getItem("save-data") === "true";

      if (useData) {
        if (localStorage.getItem("youtube-url") !== null) {
          // setUrl(localStorage.getItem("youtube-url") ?? "");
        }

        if (localStorage.getItem("youtube-timeline") !== null) {
          setTimelines(
            JSON.parse(localStorage.getItem("youtube-timeline") ?? "[]"),
          );
        }
      }
    });

    calculateMaxRows();

    window.addEventListener("resize", onWindowScroll);
    document.onvisibilitychange = () => {
      localStorage.setItem("youtube-url", $url());
      localStorage.setItem("youtube-timeline", JSON.stringify(timelines));
    };
  });

  return (
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
                  <FoldButton />
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => scrollToWorkspace()}
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
            <FoldButton />
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
                $fold()
                  ? timelines.toSpliced(0, timelines.length - $maxRows())
                  : timelines
              }
            >
              {(item, index) => (
                <TimelineRow
                  item={item}
                  fold={$fold()}
                  onTimeChange={(type, value) =>
                    changeTime(type, item.id, value)
                  }
                  deleteTimeline={() => {
                    // setTimelines((prev) => prev.toSpliced(index(), 1));
                    const currentIndex = timelines.indexOf(item);
                    setTimelines(prev => prev.toSpliced(currentIndex, 1));
                    console.log(currentIndex);
                  }}
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
  );
};
