import { FaSolidCopy } from "solid-icons/fa";
import { type JSX } from "solid-js";
import { toast } from "solid-sonner";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import * as m from "~/paraglide/messages";

interface CopyButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  copyContent: string;
  copyType: "text" | "image";
  tooltip?: string;
}

export default (props: CopyButtonProps) => {
  const copy = () => {
    if (props.copyContent === "") return;

    if (props.copyType === "text") {
      void navigator.clipboard.writeText(props.copyContent).then(() => {
        toast(m.tools_common_copy_msg());
      });
    } else {
      const imageBase64 = props.copyContent;

      const image = new Image();
      image.src = imageBase64;
      image.onerror = () => {
        toast.error(m.tools_common_copy_fail_msg());
      };
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(image, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) {
            return;
          }

          toast("Copied image to clipboard");
          return void navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob,
            }),
          ]);
        });
      };
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          onClick={() => {
            copy();
          }}
          size="icon"
          variant="ghost"
          {...props}
        >
          <FaSolidCopy class="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{props.tooltip ? props.tooltip : m.tools_common_copy()}</TooltipContent>
    </Tooltip>
  );
};
