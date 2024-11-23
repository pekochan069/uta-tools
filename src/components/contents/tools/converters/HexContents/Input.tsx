import { useStore } from "@nanostores/solid";
import { toast } from "solid-sonner";
import ClearButton from "~/components/common/ClearButton";
import CopyButton from "~/components/common/CopyButton";
import PasteButton from "~/components/common/PasteButton";
import { TextArea } from "~/components/ui/textarea";
import { input } from "./hexAtoms";

export const HexInput = () => {
  const $input = useStore(input);

  return (
    <TextArea
      id="hex-input"
      value={$input()}
      onChange={(value) => input.set(value)}
      rows="8"
      class="resize-none"
    />
  );
};

export const HexInputClearButton = () => {
  return <ClearButton onClick={() => input.set("")} />;
};

export const HexInputPasteButton = () => {
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

export const HexInputCopyButton = () => {
  return <CopyButton copyContent={input.get()} copyType="text" />;
};
