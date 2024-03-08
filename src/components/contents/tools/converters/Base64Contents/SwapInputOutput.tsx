import { useStore } from "@nanostores/solid";
import { IoSwapVertical } from "solid-icons/io";

import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { input, output } from "./base64Atoms";

export default () => {
  const $output = useStore(output);

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          class="h-full"
          onClick={() => {
            if ($output().status === "invalid") return;
            if ($output().value === "") return;

            input.set($output().value);
          }}
        >
          <IoSwapVertical class="h-8 w-8" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Swap input and output</TooltipContent>
    </Tooltip>
  );
};
