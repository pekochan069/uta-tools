import { useStore } from "@nanostores/solid";
import { TbDownload } from "solid-icons/tb";
import { createEffect, For, Show } from "solid-js";

import { videoId } from "./thumbnailAtoms";
import { Button } from "~/components/ui/button";

export default () => {
  const $videoId = useStore(videoId);

  const baseUrl = "https://img.youtube.com/vi";
  const imgList = [
    "maxresdefault.jpg",
    "sddefault.jpg",
    "hqdefault.jpg",
    "mqdefault.jpg",
  ];

  return (
    <>
      <Show when={$videoId()}>
        <div class="flex flex-col items-center gap-8">
          <For each={imgList}>
            {(imgType) => (
              <div class="hidden" id={imgType}>
                <div class="flex items-end justify-between">
                  <p class="font-lg font-semibold">
                    {imgType.replace(".jpg", "")}
                  </p>
                  {/* <Button
                    class="cursor-default bg-none text-muted hover:bg-none hover:text-muted"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      
                    }}
                  >
                    <TbDownload class="h-[1.2rem] w-[1.2rem]" />
                  </Button> */}
                </div>
                <img
                  class="mt-1"
                  id={`${imgType}-img`}
                  src={`${baseUrl}/${$videoId()}/${imgType}`}
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.naturalWidth !== 120) {
                      document
                        .getElementById(imgType)!
                        .classList.remove("hidden");
                    }
                  }}
                />
              </div>
            )}
          </For>
        </div>
      </Show>
    </>
  );
};
