import { VsClearAll } from "solid-icons/vs";
import { type JSX } from "solid-js";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";

// interface CopyButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
// 	copyContent: string;
// 	copyType: "text" | "image";
// 	tooltip?: string;
// }

interface ClearButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: string;
}

export default (props: ClearButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button size="icon" variant="ghost" {...props}>
          <VsClearAll class="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{props.tooltip ? props.tooltip : "Clear"}</TooltipContent>
    </Tooltip>
  );
};
