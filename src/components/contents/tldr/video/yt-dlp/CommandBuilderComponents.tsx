import { useStore } from "@nanostores/solid";
import type { JSX } from "astro/jsx-runtime";
import { For, Show, createSignal } from "solid-js";
import { match } from "ts-pattern";

import {
  type CommandType,
  type OptionType,
  command,
  cookies,
  format,
  link,
  time,
} from "~/atoms/tldr/video/yt-dlp";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { formatTime, toggleOption } from "./CommandBuilder";
import { FormatInput } from "./Format";

export const Command = () => {
  const $link = useStore(link);
  const $command = useStore(command);

  return (
    <>
      {match($command())
        .with("youtube-video", (data) => <YoutubeVideo />)
        .with("youtube-stream", (data) => <YoutubeStream />)
        .with("youtube-playlist", (data) => <YoutubePlaylist />)
        .with("external-video", (data) => <External />)
        .exhaustive()}{" "}
      {$link() === "" ? (
        <span class="capitalize text-muted-foreground">Link</span>
      ) : (
        $link()
      )}
    </>
  );
};

const YoutubeVideo = () => {
  return (
    <>
      <Format />
      <Cookies />
      <Time />
    </>
  );
};

const YoutubeStream = () => {
  return (
    <>
      <span> --live-from-start</span>
      <Cookies />
    </>
  );
};

const YoutubePlaylist = () => {
  return (
    <>
      <Cookies />
    </>
  );
};

const External = () => {
  return (
    <>
      <Cookies />
    </>
  );
};

const Cookies = () => {
  const $cookies = useStore(cookies);

  return (
    <Show when={$cookies().enabled}>
      <span>
        {" "}
        --cookies{" "}
        {$cookies().value === "" ? (
          <span class="text-muted-foreground">./cookies.txt</span>
        ) : (
          $cookies().value
        )}
      </span>
    </Show>
  );
};

const Format = () => {
  const $format = useStore(format);

  return (
    <Show when={$format().enabled}>
      <span>
        {" "}
        -f{" "}
        {$format().value === "" ? (
          <span class="text-muted-foreground">bv*+ba/b</span>
        ) : (
          $format().value
        )}
      </span>
    </Show>
  );
};

const Time = () => {
  const $time = useStore(time);

  return (
    <Show when={$time().enabled}>
      <span>
        {" "}
        --download-sections "*
        {formatTime($time().value)}"
      </span>
    </Show>
  );
};

export const SelectType = () => {
  const $command = useStore(command);

  const getLabel = (
    str:
      | "youtube-video"
      | "youtube-stream"
      | "youtube-playlist"
      | "external-video",
  ) => {
    return match(str)
      .with("youtube-video", () => "유튜브 비디오")
      .with("youtube-stream", () => "유튜브 라이브스트림")
      .with("youtube-playlist", () => "유튜브 플레이리스트")
      .with("external-video", () => "외부 비디오")
      .exhaustive();
  };

  return (
    <Select
      value={$command()}
      onChange={(value) => {
        if (value === null) return;

        command.set(value);
      }}
      options={[
        "youtube-video",
        "youtube-stream",
        "youtube-playlist",
        "external-video",
      ]}
      itemComponent={(props) => (
        <SelectItem item={props.item}>
          {getLabel(props.item.rawValue)}
        </SelectItem>
      )}
    >
      <SelectTrigger>
        <SelectValue<CommandType>>
          {(state) => getLabel(state.selectedOption())}
        </SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
};

const OptionBadge = (props: { children: JSX.Element; name: OptionType }) => {
  const $command = useStore(command);
  const [variant, setVariant] = createSignal<"outline" | "destructive">(
    match(props.name)
      .with("cookies", () => cookies.get().enabled)
      .with("format", () => format.get().enabled)
      .with("time", () => time.get().enabled)
      .exhaustive()
      ? "destructive"
      : "outline",
  );

  return (
    <Badge
      variant={variant()}
      onClick={() => {
        setVariant((prev) => (prev === "outline" ? "destructive" : "outline"));
        toggleOption(props.name);
      }}
      class="select-none duration-100"
    >
      {props.children}
    </Badge>
  );
};

export const OptionBadges = () => {
  const $command = useStore(command);

  const options = () =>
    match($command())
      .with("youtube-video", () => [
        <OptionBadge name="cookies">쿠키</OptionBadge>,
        <OptionBadge name="format">포맷</OptionBadge>,
        <OptionBadge name="time">시간</OptionBadge>,
      ])
      .with("youtube-stream", () => [
        <OptionBadge name="cookies">쿠키</OptionBadge>,
      ])
      .with("youtube-playlist", () => [
        <OptionBadge name="cookies">쿠키</OptionBadge>,
      ])
      .with("external-video", () => [
        <OptionBadge name="cookies">쿠키</OptionBadge>,
      ])
      .exhaustive();

  return <For each={options()}>{(option) => option}</For>;
};

export const OptionsInputs = () => {
  const $command = useStore(command);

  return (
    <>
      {match($command())
        .with("youtube-video", () => <YoutubeVideoOptionsInputs />)
        .with("youtube-stream", () => <YoutubeStreamOptionsInputs />)
        .with("youtube-playlist", () => <YoutubePlaylistOptionsInputs />)
        .with("external-video", () => <ExternalVideoOptionsInputs />)
        .exhaustive()}
    </>
  );
};

const YoutubeVideoOptionsInputs = () => {
  return (
    <>
      <FormatInput />
      <CookiesInput />
      <TimeInput />
    </>
  );
};

const YoutubeStreamOptionsInputs = () => {
  return (
    <>
      <CookiesInput />
    </>
  );
};

const YoutubePlaylistOptionsInputs = () => {
  return (
    <>
      <CookiesInput />
    </>
  );
};

const ExternalVideoOptionsInputs = () => {
  return (
    <>
      <CookiesInput />
    </>
  );
};

const CookiesInput = () => {
  const $cookies = useStore(cookies);

  return (
    <Show when={$cookies().enabled}>
      <div>
        <Label>
          쿠키
          <Input
            value={$cookies().value}
            onChange={(value) => cookies.set({ ...$cookies(), value })}
          />
        </Label>
      </div>
    </Show>
  );
};

const TimeInput = () => {
  const $time = useStore(time);

  return (
    <Show when={$time().enabled}>
      <div>
        <Label>시간</Label>
      </div>
    </Show>
  );
};
