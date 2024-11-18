import { useStore } from "@nanostores/solid";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import FileUploader from "~/components/common/FileUploader";
import { Callout, CalloutContent, CalloutTitle } from "~/components/ui/callout";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
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
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="converting">
            <div class="relative">
              Converting
              <div
                class="absolute inset-0 -left-5 top-1/2 hidden size-3 -translate-y-1/2 animate-pulse rounded-full bg-primary data-[visible=true]:block"
                data-visible={showConvertingPing()}
              ></div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="results" class="relative">
            <div class="relative">
              Results
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
        <CalloutTitle>주의사항</CalloutTitle>
        <CalloutContent>
          <p>
            이미지 변환은 클라이언트에서 이루어지며, 변환 중에 페이지를 닫거나 새로고침하면 변환
            작업이 중단됩니다. 또한 변환시 많은 양의 메모리를 사용하기 때문에 변환 후에는 이미지들을
            제거해 메모리를 해제해주세요. 너무 많은 이미지 변환은 메모리 부족 현상을 일으켜
            브라우저가 렉이 심하게 걸리거나 페이지가 죽을 수 있습니다.
          </p>
        </CalloutContent>
      </Callout>
    </div>
  );
}
