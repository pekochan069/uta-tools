import type { ImageFormat } from "./types";
import { useStore } from "@nanostores/solid";
import { createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
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
import { $batchFormat, $convertQueue, $imagesQueue } from "./atoms";
import { availableFormats, imageFormatToExtension } from "./types";
import { createTask } from "./worker";

export function Batch() {
  const imagesQueue = useStore($imagesQueue);
  const batchFormat = useStore($batchFormat);
  const open = () => (batchFormat() === "None" ? false : true);
  const [quality, setQuality] = createSignal(100);

  return (
    <Collapsible defaultOpen={false} open={open()} class="space-y-2 rounded-lg border p-4">
      <CollapsibleTrigger class="flex w-full flex-1 cursor-default items-center justify-between">
        <div class="flex flex-1 flex-col text-start">
          <div class="font-semibold">Batch Convert</div>
          <div class="hidden text-sm text-muted-foreground lg:block">
            Select target format and convert multiple images at onc
          </div>
        </div>
        <Select
          options={availableFormats}
          value={batchFormat()}
          onChange={(value) => $batchFormat.set(value === null ? "None" : value)}
          itemComponent={(e) => <SelectItem item={e.item}>{e.item.rawValue}</SelectItem>}
          class="flex-0"
        >
          <SelectTrigger
            class="w-28"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <SelectValue<ImageFormat>>{(state) => state.selectedOption()}</SelectValue>
          </SelectTrigger>
          <SelectContent class="max-h-64 overflow-auto" />
        </Select>
      </CollapsibleTrigger>
      <CollapsibleContent class="animate-collapsible-up overflow-y-hidden pb-2 text-sm transition-all data-[expanded]:animate-collapsible-down">
        <div class="flex items-center justify-between gap-16">
          <div class="z-50 flex flex-1 flex-col justify-start gap-2 py-1">
            <Slider
              minValue={1}
              maxValue={100}
              getValueLabel={(params) => `${params.values[0]}`}
              value={[quality()]}
              onChange={([v]) => setQuality(v)}
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
              if (imagesQueue().length === 0) return;

              imagesQueue().forEach((item) => {
                const fileNameParts = item.file.name.split(".");
                fileNameParts.pop();
                const fileName = `${fileNameParts.join(".")}.${imageFormatToExtension(batchFormat())}`;

                const task = {
                  id: item.id,
                  file: item.file,
                  interlaced: false,
                  outputType: batchFormat(),
                  quality: quality(),
                };
                createTask(task);
                $convertQueue.value.push({ ...task, fileName });
                $convertQueue.notify();
              });
            }}
          >
            Convert
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
