import { useStore } from "@nanostores/solid";
import { For, Show } from "solid-js";
import * as m from "~/paraglide/messages";
import { $videoId } from "./thumbnailAtoms";

function translateImgType(imgType: string) {
  switch (imgType.replace(".jpg", "")) {
    case "maxresdefault":
      return m.tools_youtube_thumbnail_maxresdefault();
    case "sddefault":
      return m.tools_youtube_thumbnail_sddefault();
    case "hqdefault":
      return m.tools_youtube_thumbnail_hqdefault();
    case "mqdefault":
      return m.tools_youtube_thumbnail_mqdefault();
  }
}

export default () => {
  const videoId = useStore($videoId);

  const baseUrl = "https://img.youtube.com/vi";
  const imgList = ["maxresdefault.jpg", "sddefault.jpg", "hqdefault.jpg", "mqdefault.jpg"];

  return (
    <>
      <Show when={videoId()}>
        <div class="flex flex-col items-start gap-8">
          <For each={imgList}>
            {(imgType) => (
              <div class="hidden" id={imgType}>
                <div class="flex items-end justify-between">
                  <p class="font-lg font-semibold">
                    {translateImgType(imgType.replace(".jpg", ""))}
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
                  src={`${baseUrl}/${videoId()}/${imgType}`}
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.naturalWidth !== 120) {
                      document.getElementById(imgType)!.classList.remove("hidden");
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
