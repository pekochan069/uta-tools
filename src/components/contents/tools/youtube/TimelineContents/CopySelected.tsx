import CopyButton from "~/components/common/CopyButton";
import * as m from "~/paraglide/messages";
import { timelines } from "./atoms";

export default () => {
  return (
    <div class="group relative">
      <CopyButton
        copyType="text"
        copyContent={timelines
          .filter((timeline) => timeline.checked)
          .map((timeline) => `${timeline.formattedTime} ${timeline.text}`)
          .join("\n")}
        class="text-foreground hover:bg-foreground hover:text-background active:bg-foreground active:text-background"
      />
      <div class="absolute top-12 z-50 w-max -translate-x-1/4 rounded-md border border-border bg-background px-3 py-1.5 text-center text-sm opacity-0 shadow-md transition-opacity duration-200 ease-in-out group-hover:opacity-100">
        {m.tools_common_copy_selected()}
      </div>
    </div>
  );
};
