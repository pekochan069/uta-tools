import { useStore } from "@nanostores/solid";
import { Match, Switch } from "solid-js";

import { format } from "~/atoms/tldr/video/yt-dlp";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type Format = {
  format: string;
  description: string;
};

export const commonFormats: Format[] = [
  {
    format: "bv*+ba/b",
    description: "오디오와 비디오를 포함하고 있는 포맷 중 가장 좋은 포맷",
  },
  {
    format: "bv*",
    description: "비디오를 포함하고 있는 포맷 중 가장 좋은 포맷",
  },
  {
    format: "bv",
    description: "비디오만 포함된 포맷 중 가장 좋은 포맷",
  },
  {
    format: "ba*",
    description: "오디오를 포함하고 있는 포맷 중 가장 좋은 포맷",
  },
  {
    format: "ba",
    description: "오디오만 포함된 포맷 중 가장 좋은 포맷",
  },
];

export const Format = () => {
  const $format = useStore(format);

  return (
    <span>
      <Switch>
        <Match when={$format().value === ""}>
          <span class="text-code-muted">{"{"}</span>
          format
          <span class="text-code-muted">{"}"}</span>
        </Match>
        <Match when={$format().value !== ""}>{$format().value}</Match>
      </Switch>
    </span>
  );
};

export const FormatInput = (props: { class?: string }) => {
  const $format = useStore(format);

  return (
    <div class={props.class}>
      <Label>
        포맷
        <Input
          value={$format().value}
          onChange={(value) => format.set({ ...$format(), value: value })}
          placeholder="bv*+ba/b"
        />
      </Label>
    </div>
  );
};

export const SelectFormatButton = (props: { format: string }) => {
  const $format = useStore(format);
  return (
    <Button
      size="sm"
      onClick={() => format.set({ ...$format(), value: props.format })}
    >
      선택
    </Button>
  );
};
