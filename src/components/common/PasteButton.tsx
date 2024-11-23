import { FaSolidPaste } from "solid-icons/fa";
import { type JSX } from "solid-js";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import * as m from "~/paraglide/messages";

type PasteButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  paste: (item: ClipboardItem) => Promise<void>;
  tooltip?: string;
};

export default (props: PasteButtonProps) => {
  const paste = async () => {
    let item;
    try {
      item = await navigator.clipboard.read();
    } catch {
      return;
    }

    await props.paste(item[0]);
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          onClick={() => {
            void paste();
          }}
          size="icon"
          variant="ghost"
          {...props}
        >
          <FaSolidPaste class="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{props.tooltip ? props.tooltip : m.tools_common_paste()}</TooltipContent>
    </Tooltip>
  );
};
