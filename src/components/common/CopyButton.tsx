import { FaSolidCopy } from "solid-icons/fa";
import { type JSX } from "solid-js";
import { toast } from "solid-sonner";

import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

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
        toast("Copied text to clipboard");
      });
    } else {
      const imageBase64 = props.copyContent;

      const image = new Image();
      image.src = imageBase64;
      image.onerror = () => {
        toast.error("Failed to copy image to clipboard");
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
      <TooltipContent>{props.tooltip ? props.tooltip : "Copy"}</TooltipContent>
    </Tooltip>
  );
};
