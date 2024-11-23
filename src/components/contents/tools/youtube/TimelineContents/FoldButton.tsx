import { useStore } from "@nanostores/solid";
import { TbDotsVertical } from "solid-icons/tb";
import { Button } from "~/components/ui/button";
import * as m from "~/paraglide/messages";
import { $fold } from "./atoms";

export default () => {
  const fold = useStore($fold);

  return (
    <div class="group relative">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          $fold.set(!fold());
        }}
        data-fold={fold() ? "fold" : "unfold"}
        class="text-foreground hover:bg-foreground hover:text-background active:bg-foreground active:text-background data-[fold=fold]:bg-destructive data-[fold=fold]:text-destructive-foreground"
      >
        <TbDotsVertical class="h-[1.2rem] w-[1.2rem]" />
      </Button>
      <div class="absolute top-12 z-50 w-max -translate-x-1/4 rounded-md border border-border bg-background px-3 py-1.5 text-center text-sm opacity-0 shadow-md transition-opacity duration-200 ease-in-out group-hover:opacity-100">
        {fold() ? m.tools_common_unfold() : m.tools_common_fold()}
      </div>
    </div>
  );
};
