import { useStore } from "@nanostores/solid";
import { BsPersonWorkspace } from "solid-icons/bs";
import { TbCirclePlus } from "solid-icons/tb";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import * as m from "~/paraglide/messages";
import { $fold, $maxRows, addTimeline, timelines } from "./atoms";
import { scrollToWorkspace } from "./ScrollToWorkspace";

export default () => {
  const fold = useStore($fold);
  const maxRows = useStore($maxRows);

  return (
    <div class="mt-2 flex justify-center gap-4">
      <Tooltip>
        <TooltipTrigger>
          <Button size="icon" variant="ghost" class="h-12 w-12" onClick={() => scrollToWorkspace()}>
            <BsPersonWorkspace class="h-8 w-8" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{m.tools_youtube_timeline_scroll_to_workspace()}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              addTimeline("");

              if (!fold()) {
                if (timelines.length > maxRows()) {
                  scroll({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }
              }
            }}
            class="h-12 w-12"
          >
            <TbCirclePlus class="h-8 w-8" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{m.tools_youtube_timeline_add_empty_timeline()}</TooltipContent>
      </Tooltip>
    </div>
  );
};
