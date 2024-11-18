import type { ImageFormat, ImageQueueItem } from "./types";
import { useStore } from "@nanostores/solid";
import { TbX } from "solid-icons/tb";
import { createSignal, For } from "solid-js";
import { Button } from "~/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Slider,
  SliderFill,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValueLabel,
} from "~/components/ui/slider";
import { formatFileSize } from "~/lib/format-file-size";
import { $convertQueue, $imagesQueue } from "./atoms";
import { availableFormats, imageFormatToMimeType, mimiTypeToExtension } from "./types";
import { createTask } from "./worker";

export default () => {
  const images = useStore($imagesQueue);

  return (
    <div class="grid gap-2">
      <h2 class="font-semibold">Images</h2>
      <For each={images()}>{(image, i) => <QueueItem item={image} />}</For>
      <div class="flex justify-end">
        <Button
          class="items-center gap-2"
          variant="outlineDestructive"
          onClick={() => $imagesQueue.set([])}
        >
          <TbX class="size-5" />
          <span>Clear All</span>
        </Button>
      </div>
    </div>
  );
};

type QueueItemProps = {
  item: ImageQueueItem;
};

function QueueItem(props: QueueItemProps) {
  const [format, setFormat] = createSignal<ImageFormat>("None");
  const [quality, setQuality] = createSignal(100);
  const open = () => (format() === "None" ? false : true);

  return (
    <Collapsible defaultOpen={false} open={open()} class="space-y-2 rounded-lg border p-4">
      <CollapsibleTrigger class="grid w-full cursor-default grid-cols-[52px_1fr_auto] items-center justify-between gap-4">
        <Dialog>
          <DialogTrigger
            onClick={(e) => {
              e.stopPropagation();
            }}
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
          <span>{formatFileSize(props.item.file.size)} bytes</span>
        </div>
        <div class="flex gap-4">
          <Select
            options={availableFormats}
            value={format()}
            onChange={(value) => setFormat(value === null ? "None" : value)}
            itemComponent={(e) => <SelectItem item={e.item}>{e.item.rawValue}</SelectItem>}
          >
            <SelectTrigger
              class="w-28"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <SelectValue<ImageFormat>>{(state) => state.selectedOption()}</SelectValue>
            </SelectTrigger>
            <SelectContent class="max-h-64 overflow-auto" id="select-content" />
          </Select>
          <Button
            variant="outlineDestructive"
            size="icon"
            onClick={() => {
              $imagesQueue.value.splice($imagesQueue.value.indexOf(props.item), 1);
              $imagesQueue.notify();
            }}
          >
            <TbX class="size-5" />
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent class="animate-collapsible-up overflow-y-hidden pb-2 text-sm transition-all data-[expanded]:animate-collapsible-down">
        <div class="flex items-center justify-between gap-16">
          <div class="z-50 flex flex-1 flex-col justify-start gap-2 py-1">
            <Slider
              minValue={1}
              maxValue={100}
              value={[quality()]}
              onChange={([v]) => setQuality(v)}
              getValueLabel={(params) => `${params.values[0]}`}
              class="space-y-2"
            >
              <div class="w-full space-x-2">
                <SliderLabel>Quality</SliderLabel>
                <SliderValueLabel class="font-bold" />
              </div>
              <SliderTrack class="ml-5">
                <SliderFill />
                <SliderThumb />
              </SliderTrack>
            </Slider>
          </div>
          <Button
            onClick={() => {
              const fileNameParts = props.item.file.name.split(".");
              fileNameParts.pop();
              const fileName = `${fileNameParts.join(".")}.${mimiTypeToExtension(format())}`;

              const task = {
                id: props.item.id,
                file: props.item.file,
                interlaced: false,
                outputType: format(),
                quality: quality(),
              };
              createTask(task);
              $convertQueue.value.push({ ...task, fileName });
              $convertQueue.notify();
            }}
          >
            Convert
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
