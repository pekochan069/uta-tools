import { onCleanup, onMount } from "solid-js";
import FileUploader from "~/components/common/FileUploader";
import { Separator } from "~/components/ui/separator";
import { $convertQueue, $imagesQueue, $results, addImages } from "./atoms";
import { Batch } from "./Batch";
import ConvertQueue from "./ConvertQueue";
import ImagesQueue from "./ImagesQueue";
import Results from "./Results";
import { accept } from "./types";

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
      <ImagesQueue />
      <Separator class="h-[2px]" />
      <ConvertQueue />
      <Separator class="h-[2px]" />
      <Results />
    </div>
  );
};
