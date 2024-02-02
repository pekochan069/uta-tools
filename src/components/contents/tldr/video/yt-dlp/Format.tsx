import { useStore } from "@nanostores/solid";
import { Match, Switch } from "solid-js";

import { cn } from "~/lib/utils";
import { format } from "~/atoms/tldr/video/yt-dlp";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const Format = () => {
  const $format = useStore(format);

  return (
    <span>
      <Switch>
        <Match when={$format().audio === "" && $format().video === ""}>
          <span class="text-code-muted">{"{"}</span>
          format
          <span class="text-code-muted">{"}"}</span>
        </Match>
        <Match when={$format().audio !== "" && $format().video === ""}>
          {$format().audio}
        </Match>
        <Match when={$format().audio === "" && $format().video !== ""}>
          {$format().video}
        </Match>
        <Match when={$format().audio !== "" && $format().video !== ""}>
          {$format().audio}+{$format().video}
        </Match>
      </Switch>
    </span>
  );
};

export const AudioFormatInput = () => {
  const $format = useStore(format);

  return (
    <div>
      <Label>
        오디오 포맷
        <Input
          value={$format().audio}
          onChange={(value) => format.set({ ...$format(), audio: value })}
          placeholder="140"
          type="number"
          min="0"
        />
      </Label>
    </div>
  );
};

export const VideoFormatInput = () => {
  const $format = useStore(format);

  return (
    <div>
      <Label>
        비디오 포맷
        <Input
          value={$format().video}
          onChange={(value) => format.set({ ...$format(), video: value })}
          placeholder="299"
          type="number"
          min="0"
        />
      </Label>
    </div>
  );
};

export const FormatInput = (props: { class: string }) => {
  return (
    <div class={cn("grid gap-4 md:grid-cols-2", props.class)}>
      <AudioFormatInput />
      <VideoFormatInput />
    </div>
  );
};

type Format = {
  type: "audio" | "video";
  format: string;
  description: string;
};

export const commonFormats: Format[] = [
  
];
