import { toast } from "solid-sonner";
import { Button } from "~/components/ui/button";
import * as m from "~/paraglide/messages";
import { timelines } from "./atoms";

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
          toast(m.tools_common_copy_msg());
        }}
        class="font-semibold"
      >
        {m.tools_common_copy()}
      </Button>
      {/* <div class="absolute right-0 top-12 z-50 w-max rounded-md border border-border bg-background px-3 py-1.5 text-center text-sm opacity-0 shadow-md transition-opacity duration-200 ease-in-out group-hover:opacity-100 xl:translate-x-1/4">
        {m.tools_youtube_timeline_copy_all_timelines()}
      </div> */}
    </div>
  );
};
