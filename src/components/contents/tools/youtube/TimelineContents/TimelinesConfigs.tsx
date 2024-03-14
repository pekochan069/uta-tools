import { useStore } from "@nanostores/solid";
import { batch, createEffect, onMount, untrack } from "solid-js";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { scrollToWorkspace } from "./ScrollToWorkspace";
import {
  url,
  player,
  playerReady,
  prevVideoId,
  rememberData,
  videoId,
} from "./timelineAtoms";

export const YoutubeUrl = () => {
  const $url = useStore(url);
  const $playerReady = useStore(playerReady);
  const $videoId = useStore(videoId);
  const $player = useStore(player);
  const $prevVideoId = useStore(prevVideoId);

  createEffect(() => {
    if (typeof window === "undefined") return;

    if ($videoId() === "" || $videoId() === $prevVideoId()) return;

    if (untrack($playerReady)) {
      batch(() => {
        $player().loadVideoById($videoId(), 0, "large");
        prevVideoId.set($videoId());
        scrollToWorkspace();
      });

      return;
    }

    batch(() => {
      playerReady.set(false);
      player.set(
        // @ts-ignore
        new YT.Player("player", {
          videoId: $videoId(),
          events: {
            // @ts-ignore
            onReady: (event) => {
              batch(() => {
                prevVideoId.set($videoId());
                playerReady.set(true);
              });

              event.target.playVideo();
              scrollToWorkspace();
            },
          },
        }),
      );
    });
  });

  createEffect(() => {
    if ($playerReady() || (!$playerReady() && $videoId() !== "")) {
      const playerPlaceholder = document.getElementById(
        "player-placeholder-image",
      );
      if (playerPlaceholder) {
        playerPlaceholder.dataset.player = "ready";
      }
    }
  });

  return (
    <Input
      value={$url()}
      onChange={(value) => url.set(value)}
      type="text"
      placeholder="http://youtu.be/{videoId}"
      class=" min-w-[16rem] xl:min-w-[24rem]"
    />
  );
};

export const RememberData = () => {
  const $rememberData = useStore(rememberData);

  onMount(() => {
    const data = localStorage.getItem("save-data");
    if (data === null) return;

    rememberData.set(data === "true");
  });

  createEffect(() => {
    localStorage.setItem("save-data", `${$rememberData()}`);
  });

  return (
    <>
      <Label for="operation" class="select-none capitalize">
        {$rememberData() ? "On" : "Off"}
      </Label>
      <Switch
        id="operation"
        checked={$rememberData()}
        onChange={(value) => rememberData.set(value)}
      />
    </>
  );
};
