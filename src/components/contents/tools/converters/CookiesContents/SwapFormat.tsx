import { IoSwapVertical } from "solid-icons/io";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import * as m from "~/paraglide/messages";
import { format } from "./cookieAtoms";

export const SwapFormat = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const currentFormat = format.get();
            format.set({ from: currentFormat.to, to: currentFormat.from });
          }}
        >
          <IoSwapVertical class="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{m.tools_converters_swap_io()}</TooltipContent>
    </Tooltip>
  );
};
