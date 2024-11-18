import type { ConvertQueueItem } from "./types";
import { useStore } from "@nanostores/solid";
import { ImSpinner8 } from "solid-icons/im";
import { TbArrowRight, TbX } from "solid-icons/tb";
import { For } from "solid-js";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { formatFileSize } from "~/lib/format-file-size";
import { cn } from "~/lib/utils";
import { $convertQueue } from "./atoms";

export default (props: { class: string }) => {
  const convertQueue = useStore($convertQueue);

  return (
    <div class={cn("grid gap-2", props.class)}>
      <h2 class="font-semibold">Converting</h2>
      <For each={convertQueue()}>{(item) => <QueueItem item={item} />}</For>
      <div class="mt-8 flex justify-end">
        <Button
          class="items-center gap-2"
          variant="outlineDestructive"
          onClick={() => $convertQueue.set([])}
        >
          <TbX class="size-5" />
          <span>Clear All</span>
        </Button>
      </div>
    </div>
  );
};

type QueueItemProps = {
  item: ConvertQueueItem;
};

function QueueItem(props: QueueItemProps) {
  return (
    <div class="grid animate-bg-load grid-cols-[52px_1fr_auto] items-center justify-between gap-4 rounded-md border bg-gradient-to-r from-background from-35% via-accent via-50% to-background to-65% px-4 py-2 [animation-duration:3000ms] [background-size:300%_100%]">
      <Dialog>
        <DialogTrigger
          onClick={(e) => {
            e.stopPropagation();
          }}
          class="pointer-events-auto"
        >
          <img
            src={URL.createObjectURL(props.item.file)}
            alt={props.item.file.name}
            class="h-[52px] w-[52px] rounded-sm object-scale-down"
          />
        </DialogTrigger>
        <DialogContent class="grid place-content-center">
          <img
            src={URL.createObjectURL(props.item.file)}
            alt={props.item.file.name}
            class="max-h-[75svh] rounded-sm object-scale-down"
          />
        </DialogContent>
      </Dialog>
      <div class="flex min-w-0 flex-col gap-1 text-start">
        <span class="w-full truncate font-bold">{props.item.file.name}</span>
        <div class="flex items-center gap-4">
          <span>{formatFileSize(props.item.file.size)} bytes</span>
          <div class="flex items-center gap-2">
            <TbArrowRight />
            <span class="font-semibold uppercase">{props.item.outputType}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Button
          variant="outlineDestructive"
          size="icon"
          onClick={() => {
            $convertQueue.value.splice($convertQueue.value.indexOf(props.item), 1);
            $convertQueue.notify();
          }}
        >
          <TbX class="size-5" />
        </Button>
      </div>
    </div>
  );
}
