import { TbCirclePlus } from "solid-icons/tb";
import { Button } from "~/components/ui/button";

export default () => {
  return (
    <div class="group relative">
      <Button size="icon" variant="ghost">
        <TbCirclePlus class="h-[1.6rem] w-[1.6rem]" />
      </Button>
      <div class="absolute top-12 z-50 w-max -translate-x-1/4 rounded-md border border-border bg-background px-3 py-1.5 text-center text-sm opacity-0 shadow-md transition-opacity duration-200 ease-in-out group-hover:opacity-100">
        Add timeline
      </div>
    </div>
  );
};
