import { TextField } from "@kobalte/core";
import { BiSolidImageAlt } from "solid-icons/bi";
import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import { toast } from "solid-sonner";
import ClearButton from "~/components/common/ClearButton";
import CopyButton from "~/components/common/CopyButton";
import FileUploader from "~/components/common/FileUploader";
import PasteButton from "~/components/common/PasteButton";
import * as m from "~/paraglide/messages";

export default () => {
  let imgRef: HTMLImageElement | undefined;

  const [text, setText] = createSignal("");
  const [image, setImage] = createSignal("");
  const [file, setFile] = createSignal<File>();
  const [validImage, setValidImage] = createSignal(false);

  const windowDropEvent = (e: DragEvent) => {
    e.preventDefault();
  };

  onMount(() => {
    window.addEventListener("drop", windowDropEvent);
    window.addEventListener("dragover", windowDropEvent);
  });

  onCleanup(() => {
    window.removeEventListener("drop", windowDropEvent);
    window.removeEventListener("dragover", windowDropEvent);
  });

  createEffect(() => {
    setValidImage(true);
    setImage(text());
  });

  createEffect(() => {
    const reader = new FileReader();

    if (!file()) return;
    reader.readAsDataURL(file() as File);

    reader.onload = () => {
      setText(reader.result as string);
    };
  });

  return (
    <div class="flex flex-col gap-6">
      <FileUploader onUpload={(files) => setFile(files[0])} accept="image/*" id="input-file" />
      <div class="flex flex-col gap-2">
        <div class="mb-4">
          <div class="mb-2 flex items-end justify-between">
            <p class="text-sm font-semibold">{m.tools_common_text()}</p>
            <div class="flex gap-1">
              <ClearButton
                onClick={() => {
                  setText("");
                }}
              />
              <PasteButton
                paste={async (item) => {
                  try {
                    const data = await item.getType("text/plain");
                    const textData = await data.text();
                    setText(textData);
                  } catch {
                    toast.error(m.tools_common_cannot_paste_msg());
                    return;
                  }
                }}
              />
              <CopyButton copyType="text" copyContent={text()} />
            </div>
          </div>
          <TextField.Root
            value={text()}
            onChange={setText}
            validationState={validImage() ? "valid" : "invalid"}
          >
            <TextField.TextArea
              id="text"
              rows={8}
              placeholder="Enter text to encode/decode"
              class="min-h-[80px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ui-not-valid:border-red-500 ui-not-valid:ring-red-300"
            />
            <TextField.ErrorMessage class="absolute mt-1 text-sm text-red-500">
              {m.tools_common_invalid_input()}
            </TextField.ErrorMessage>
          </TextField.Root>
        </div>
      </div>
      <div>
        <div class="mb-2 flex items-end justify-between">
          <p class="text-sm font-semibold">{m.tools_common_image()}</p>
          <CopyButton copyType="image" copyContent={image()} />
        </div>
        <div class="grid aspect-video place-content-center overflow-hidden rounded-md border-[1px]">
          <Show when={image() !== ""} fallback={<BiSolidImageAlt class="h-16 w-16" />}>
            <img
              src={image()}
              ref={imgRef}
              alt="Decoded"
              class="w-full object-contain"
              onError={() => {
                setValidImage(false);
                imgRef?.classList.add("hidden");
              }}
              onLoad={() => {
                setValidImage(true);
                imgRef?.classList.remove("hidden");
              }}
            />
          </Show>
        </div>
      </div>
    </div>
  );
};
