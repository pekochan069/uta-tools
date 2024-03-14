import { useStore } from "@nanostores/solid";
import { toast } from "solid-sonner";

import { Button } from "~/components/ui/button";
import { timelines } from "./timelineAtoms";

export default () => {
  return (
    <div class="group relative">
      <Button
        onClick={() => {
          if (timelines.length === 0) return;

          const text = timelines
            .map((timeline) => `${timeline.formattedTime} ${timeline.text}`)
            .join("\n");

          void navigator.clipboard.writeText(text);
          toast("Copied timeline to clipboard");
        }}
        class="font-semibold"
      >
        Copy
      </Button>
      <div class="absolute top-12 z-50 w-max -translate-x-1/4 rounded-md border border-border bg-background px-3 py-1.5 text-center text-sm opacity-0 shadow-md transition-opacity duration-200 ease-in-out group-hover:opacity-100">
        Copy all timeline
      </div>
    </div>
  );
};
