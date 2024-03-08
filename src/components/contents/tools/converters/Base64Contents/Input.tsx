import { useStore } from "@nanostores/solid";
import { toast } from "solid-sonner";

import ClearButton from "~/components/common/ClearButton";
import CopyButton from "~/components/common/CopyButton";
import PasteButton from "~/components/common/PasteButton";
import { TextArea } from "~/components/ui/textarea";
import { input } from "./base64Atoms";

export const Base64Input = () => {
  const $input = useStore(input);

  return (
    <TextArea
      id="base64-input"
      value={$input()}
      onChange={(value) => input.set(value)}
      rows="8"
      class="resize-none"
    />
  );
};

export const Base64InputClearButton = () => {
  return <ClearButton onClick={() => input.set("")} />;
};

export const Base64InputPasteButton = () => {
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

export const Base64InputCopyButton = () => {
  return <CopyButton copyContent={input.get()} copyType="text" />;
};
