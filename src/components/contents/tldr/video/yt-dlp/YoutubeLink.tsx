import { useStore } from "@nanostores/solid";
import { Show } from "solid-js";

import { link } from "~/atoms/tldr/video/yt-dlp";
import CodeAreaCopyButton from "~/components/common/CodeAreaCopyButton";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const YoutubeLink = () => {
  const $link = useStore(link);

  return (
    <span>
      <Show
        when={$link() !== ""}
        fallback={
          <>
            <span class="text-code-muted">{"{"}</span>
            video_link
            <span class="text-code-muted">{"}"}</span>
          </>
        }
      >
        {$link()}
      </Show>
    </span>
  );
};

export const YoutubeLinkInput = () => {
  const $link = useStore(link);

  return (
    <div>
      <Label>
        유튜브 링크
        <Input
          value={$link()}
          onChange={(value) => link.set(value)}
          placeholder="https://youtu.be/pgXpM4l_MwI"
        />
      </Label>
    </div>
  );
};
