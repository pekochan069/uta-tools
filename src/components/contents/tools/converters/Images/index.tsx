import { useStore } from "@nanostores/solid";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import FileUploader from "~/components/common/FileUploader";
import { Callout, CalloutContent, CalloutTitle } from "~/components/ui/callout";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import * as m from "~/paraglide/messages";
import { $convertQueue, $imagesQueue, $results, addImages } from "./atoms";
import { Batch } from "./Batch";
import ConvertQueue from "./ConvertQueue";
import ImagesQueue from "./ImagesQueue";
import Results from "./Results";
import { accept } from "./utils";

export default () => {
  const windowDropEvent = (e: DragEvent) => {
    e.preventDefault();
  };

  onCleanup(() => {
    window.removeEventListener("drop", windowDropEvent);
    window.removeEventListener("dragover", windowDropEvent);
  });

  onMount(() => {
    window.addEventListener("drop", windowDropEvent);
    window.addEventListener("dragover", windowDropEvent);

    $imagesQueue.set([]);
    $convertQueue.set([]);
    $results.set([]);
    $imagesQueue.notify();
    $convertQueue.notify();
    $results.notify();
  });

  return <Inner />;
};

function Inner() {
  const [active, setActive] = createSignal("images");
  const convertQueue = useStore($convertQueue);
  const results = useStore($results);
  const [previousConvertQueueLength, setPreviousConvertQueueLength] = createSignal(0);
  const [previousResultsLength, setPreviousResultsLength] = createSignal(0);
  const [showConvertingPing, setShowConvertingPing] = createSignal(false);
  const [showResultsPing, setShowResultsPing] = createSignal(false);

  createEffect(() => {
    if (convertQueue().length > previousConvertQueueLength()) {
      setShowConvertingPing(true);
    }
    setPreviousConvertQueueLength(convertQueue().length);
  });

  createEffect(() => {
    if (results().length > previousResultsLength()) {
      setShowResultsPing(true);
    }
    setPreviousResultsLength(results().length);
  });

  createEffect(() => {
    if (active() === "converting") {
      setShowConvertingPing(false);
    }
  });

  createEffect(() => {
    if (active() === "results") {
      setShowResultsPing(false);
    }
  });

  createEffect(() => {
    if (convertQueue().length === 0) {
      setShowConvertingPing(false);
    }
  });

  return (
    <div class="flex flex-col gap-4">
      <FileUploader
        onUpload={(files) => {
          addImages(files);
        }}
        multiple={true}
        accept={accept}
        id="input-file"
      />
      <Batch />
      <Separator class="h-[2px]" />
      <Tabs onChange={(v) => setActive(v)} value={active()}>
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="images">{m.tools_common_image()}</TabsTrigger>
          <TabsTrigger value="converting">
            <div class="relative">
              {m.tools_common_converting()}
              <div
                class="absolute inset-0 -left-5 top-1/2 hidden size-3 -translate-y-1/2 animate-pulse rounded-full bg-primary data-[visible=true]:block"
                data-visible={showConvertingPing()}
              ></div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="results" class="relative">
            <div class="relative">
              {m.tools_common_result()}
              <div
                class="absolute inset-0 -left-5 top-1/2 hidden size-3 -translate-y-1/2 animate-pulse rounded-full bg-primary data-[visible=true]:block"
                data-visible={showResultsPing()}
              ></div>
            </div>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div class="overflow-hidden">
        <div
          class="grid grid-cols-[100%_100%_100%] transition-transform duration-300 ease-in-out data-[show=converting]:-translate-x-full data-[show=results]:-translate-x-[200%]"
          data-show={active()}
        >
          <ImagesQueue class="" />
          <ConvertQueue class="" />
          <Results class="" />
        </div>
      </div>
      <Callout variant="warning">
        <CalloutTitle>{m.tools_common_cautions()}</CalloutTitle>
        <CalloutContent>
          <p>{m.tools_converters_images_warning()}</p>
        </CalloutContent>
      </Callout>
    </div>
  );
}
