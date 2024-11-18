import { BiSolidImageAdd } from "solid-icons/bi";
import { createEffect, createSignal, mergeProps } from "solid-js";
import { Input } from "~/components/ui/input";

type ImageUploaderProps = {
  onUpload: (file: FileList) => void;
  accept?: string;
  multiple?: boolean;
  id: string;
};

export default (props: ImageUploaderProps) => {
  const merged = mergeProps({ accept: "*", multiple: false }, props);

  let imageAddIconRef: SVGSVGElement | undefined;

  return (
    <div class="group">
      <input
        type="file"
        multiple={merged.multiple}
        accept={merged.accept}
        id={merged.id}
        onInput={(e) => {
          const files = e.currentTarget.files;

          if (files) {
            merged.onUpload(files);
          }
        }}
        class="hidden"
      />
      <label
        for={merged.id}
        onDragEnter={(e) => {
          e.preventDefault();
          if (!imageAddIconRef) return;
          if (!imageAddIconRef.classList.contains("text-muted-foreground")) {
            imageAddIconRef.classList.add("text-muted-foreground");
          }
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          imageAddIconRef?.classList.remove("text-muted-foreground");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          imageAddIconRef?.classList.remove("text-muted-foreground");

          if (e.dataTransfer?.files) {
            merged.onUpload(e.dataTransfer!.files);
          }
        }}
        class="grid h-32 place-content-center rounded-md border-[1px] hover:cursor-pointer"
      >
        <BiSolidImageAdd
          ref={imageAddIconRef}
          class="h-16 w-16 transition-colors duration-100 group-hover:text-muted-foreground"
        />
      </label>
    </div>
  );
};
