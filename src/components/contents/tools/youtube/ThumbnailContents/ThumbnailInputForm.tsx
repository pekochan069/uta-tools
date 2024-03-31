import { Input } from "~/components/ui/input";
import { url, videoId } from "./thumbnailAtoms";
import { useStore } from "@nanostores/solid";
import { Button } from "~/components/ui/button";
import { onMount } from "solid-js";
import { getVideoId } from "~/lib/youtube";

export default () => {
  const $url = useStore(url);
  const computedVideoId = () => getVideoId($url());

  const onSubmit = (e: Event) => {
    e.preventDefault();

    videoId.set(computedVideoId())
  };

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <div class="flex flex-col gap-y-4 md:flex-row md:gap-x-4">
        <Input
          rootClass="flex-1"
          class="flex-1"
          value={$url()}
          onChange={(value) => url.set(value)}
          placeholder="https://www.youtube.com/watch?v=pgXpM4l_MwI"
        />
        <Button type="submit">
          Get
        </Button>
      </div>
    </form>
  );
};
