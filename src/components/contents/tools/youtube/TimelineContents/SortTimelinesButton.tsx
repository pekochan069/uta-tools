import { Button } from "~/components/ui/button";
import * as m from "~/paraglide/messages";
import { setTimelines, timelines } from "./atoms";

export default () => {
  return (
    <div class="group relative">
      <Button
        onClick={() => {
          if (timelines.length === 0) return;

          setTimelines(
            timelines.toSorted((a, b) => {
              const aSeconds = a.time[0] * 3600 + a.time[1] * 60 + a.time[2];
              const bSeconds = b.time[0] * 3600 + b.time[1] * 60 + b.time[2];

              return aSeconds - bSeconds;
            }),
          );
        }}
        class="font-semibold"
      >
        {m.tools_common_sort()}
      </Button>
      {/* <div class="absolute top-12 z-50 w-max -translate-x-1/4 rounded-md border border-border bg-background px-3 py-1.5 text-center text-sm opacity-0 shadow-md transition-opacity duration-200 ease-in-out group-hover:opacity-100">
        {m.tools_youtube_timeline_sort_timelines()}
      </div> */}
    </div>
  );
};
