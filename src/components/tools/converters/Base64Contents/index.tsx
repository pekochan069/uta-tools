import { TextField } from "@kobalte/core";
import { IoSwapVertical } from "solid-icons/io";
import { TbMinus, TbPlus } from "solid-icons/tb";
import { Show, createSignal } from "solid-js";
import { toast } from "solid-sonner";
import ClearButton from "~/components/common/ClearButton";
import {
  ContentConfig,
  ContentConfigLabel,
  ContentConfigRoot,
  ContentConfigSection,
} from "~/components/common/Config";
import CopyButton from "~/components/common/CopyButton";
import PasteButton from "~/components/common/PasteButton";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";

export default () => {
  const [isEncode, setIsEncode] = createSignal(true);
  const [repeat, setRepeat] = createSignal(1);
  const [input, setInput] = createSignal("");
  const [isValidInput, setIsValidInput] = createSignal(true);

  const output = () => {
    setIsValidInput(true);
    if (input() === "") {
      return "";
    }

    try {
      let out = input();
      const op = isEncode() ? btoa : atob;
      for (let i = 0; i < repeat(); i++) {
        out = op(out);
      }
      return out;
    } catch (e) {
      setIsValidInput(false);
    }
  };

  return (
    <div class="flex flex-col">
      <div class="mb-6">
        <ContentConfigSection>
          <ContentConfigRoot>
            <ContentConfigLabel
              name="Operation"
              description="Select whether to encode or decode the input"
            />
            <ContentConfig>
              <label for="operation">
                <Show when={isEncode()} fallback="Decode">
                  Encode
                </Show>
              </label>
              <Switch
                id="operation"
                checked={isEncode()}
                onChange={() => setIsEncode((prev) => !prev)}
              />
            </ContentConfig>
          </ContentConfigRoot>
          <ContentConfigRoot>
            <ContentConfigLabel
              name="Repeat"
              description="Set repeat count for operation"
            />
            <ContentConfig>
              <Button
                variant="outline"
                onClick={() => {
                  if (repeat() > 1) {
                    setRepeat((prev) => prev - 1);
                  }
                }}
              >
                <TbMinus />
              </Button>
              <Input
                type="number"
                min="1"
                max="9"
                readOnly
                value={repeat().toString()}
                class="w-12 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (repeat() < 9) {
                    setRepeat((prev) => prev + 1);
                  }
                }}
              >
                <TbPlus />
              </Button>
            </ContentConfig>
          </ContentConfigRoot>
        </ContentConfigSection>
      </div>
      <div class="flex flex-col gap-2 md:mb-2">
        <div class="mb-4">
          <div class="mb-2 flex items-end justify-between">
            <label for="input" class="text-sm font-semibold">
              Input
            </label>
            <div class="flex gap-1">
              <ClearButton onClick={() => setInput("")} />
              <PasteButton
                paste={async (item) => {
                  try {
                    const data = await item.getType("text/plain");
                    const textData = await data.text();
                    setInput(textData);
                  } catch {
                    toast.error("Cannot paste text from clipboard");
                    return;
                  }
                }}
              />
              <CopyButton copyType="text" copyContent={input()} />
            </div>
          </div>
          <TextField.Root
            value={input()}
            onChange={setInput}
            validationState={isValidInput() ? "valid" : "invalid"}
          >
            <TextField.TextArea
              id="input"
              rows={8}
              placeholder="Enter text to encode/decode"
              class="min-h-[80px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ui-not-valid:border-red-500 ui-not-valid:ring-red-300"
            />
            <TextField.ErrorMessage class="absolute mt-1 text-sm text-red-500">
              Invalid input
            </TextField.ErrorMessage>
          </TextField.Root>
        </div>
      </div>
      <div class="grid place-content-center md:mb-2">
        <Button
          variant="ghost"
          class="h-full"
          onClick={() => {
            setInput(output() ?? "");
          }}
        >
          <IoSwapVertical class="h-8 w-8" />
        </Button>
      </div>
      <div>
        <div class="mb-2 flex items-end justify-between">
          <label for="output" class="text-sm font-semibold">
            Output
          </label>
          <CopyButton copyType="text" copyContent={output() ?? ""} />
        </div>
        <TextField.Root value={output()}>
          <TextField.TextArea
            readOnly
            rows={8}
            id="output"
            placeholder="Output will appear here"
            class="min-h-[80px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onFocus={(e) => e.target.select()}
          />
        </TextField.Root>
      </div>
    </div>
  );
};
