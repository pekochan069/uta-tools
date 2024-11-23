import { useStore } from "@nanostores/solid";
import { batch } from "solid-js";
import { toast } from "solid-sonner";
import ClearButton from "~/components/common/ClearButton";
import CopyButton from "~/components/common/CopyButton";
import PasteButton from "~/components/common/PasteButton";
import { TextArea } from "~/components/ui/textarea";
import { format, input } from "./cookieAtoms";

export const CookiesInput = () => {
  const $input = useStore(input);

  return (
    <TextArea
      id="cookies-input"
      class="resize-none"
      value={$input()}
      rows={16}
      onChange={(value) => {
        if (value === "") {
          input.set("");
          return;
        }

        batch(() => {
          const split = value
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line !== "");

          if (split.length === 0) {
            input.set("");
            return;
          }

          if (split[0].startsWith("{") || split[0].startsWith("[")) {
            format.set({ from: "json", to: "netscape" });
          } else {
            for (const line of split) {
              const trimmed = line.trim();
              if (trimmed === "# Netscape HTTP Cookie File") {
                format.set({ from: "netscape", to: "json" });
                break;
              }
            }
          }

          input.set(value);
        });
      }}
    />
  );
};

export const CookiesInputClearButton = () => {
  return <ClearButton onClick={() => input.set("")} />;
};

export const CookiesInputCopyButton = () => {
  const $input = useStore(input);

  return <CopyButton copyType="text" copyContent={$input()} />;
};

export const CookiesInputPasteButton = () => {
  return (
    <PasteButton
      paste={async (item) => {
        try {
          const data = await item.getType("text/plain");
          const textData = await data.text();
          input.set(textData);
        } catch {
          toast.error("Cannot paste text from clipboard");
          return;
        }
      }}
    />
  );
};
