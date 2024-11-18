import type { ResultItem } from "./types";
import { useStore } from "@nanostores/solid";
import { TbDownload, TbX } from "solid-icons/tb";
import { For, Show } from "solid-js";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { formatFileSize } from "~/lib/format-file-size";
import { cn } from "~/lib/utils";
import { $convertQueue, $results } from "./atoms";

export default (props: { class: string }) => {
  const results = useStore($results);

  return (
    <div class={cn("grid gap-2", props.class)}>
      <h2 class="font-semibold">Results</h2>
      <For each={results()}>{(item) => <ResultItem item={item} />}</For>
      <div class="mt-8 flex justify-end gap-2">
        <Button
          class="items-center gap-2"
          variant="outlineDestructive"
          onClick={() => $results.set([])}
        >
          <TbX class="size-5" />
          <span>Clear All</span>
        </Button>
        <Button
          class="items-center gap-2"
          onClick={() => {
            results().forEach((item) => {
              const link = document.createElement("a");
              link.download = item.fileName;
              link.href = URL.createObjectURL(new Blob([item.result], { type: item.outputType }));
              link.click();
            });
          }}
        >
          <TbDownload class="size-5" />
          <span>Download All</span>
        </Button>
      </div>
    </div>
  );
};

type ResultItemProps = {
  item: ResultItem;
};

function ResultItem(props: ResultItemProps) {
  const blob = () => new Blob([props.item.result], { type: props.item.outputType });

  const img = () => URL.createObjectURL(blob());

  return (
    <div
      class="grid grid-cols-[52px_1fr_auto] items-center justify-between gap-4 rounded-md border px-4 py-2 data-[error=true]:grid-cols-[1fr_auto] data-[error=true]:border-destructive data-[error=true]:text-destructive"
      data-error={props.item.status === "error"}
    >
      <Show when={props.item.status === "ok"}>
        <Dialog>
          <DialogTrigger
            onClick={(e) => {
              e.stopPropagation();
            }}
            class="pointer-events-auto"
          >
            <img
              src={img()}
              alt={props.item.fileName}
              class="h-[52px] w-[52px] rounded-sm object-scale-down"
            />
          </DialogTrigger>
          <DialogContent class="grid place-content-center">
            <img
              src={img()}
              alt={props.item.fileName}
              class="max-h-[75svh] rounded-sm object-scale-down"
            />
          </DialogContent>
        </Dialog>
      </Show>
      <div class="flex min-w-0 flex-col gap-1 text-start">
        <span class="w-full truncate font-bold">{props.item.fileName}</span>
        <span>{formatFileSize(props.item.result.byteLength)} bytes</span>
      </div>
      <div class="flex items-center gap-2">
        <Button
          variant="outlineDestructive"
          size="icon"
          onClick={() => {
            $results.value.splice($results.value.indexOf(props.item), 1);
            $results.notify();
          }}
        >
          <TbX class="size-5" />
        </Button>
        <Button
          size="icon"
          onClick={() => {
            const link = document.createElement("a");
            link.download = props.item.fileName;
            link.href = img();
            link.click();
          }}
          disabled={props.item.status === "error"}
        >
          <TbDownload class="size-5" />
        </Button>
      </div>
    </div>
  );
}
