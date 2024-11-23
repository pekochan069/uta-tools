import { useStore } from "@nanostores/solid";
import { BsPersonWorkspace } from "solid-icons/bs";
import { TbCirclePlus } from "solid-icons/tb";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
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
        <TooltipContent>Scroll to Workspace</TooltipContent>
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
        <TooltipContent>Add empty timeline</TooltipContent>
      </Tooltip>
    </div>
  );
};
