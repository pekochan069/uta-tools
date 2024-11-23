import { useStore } from "@nanostores/solid";
import { TbCirclePlus } from "solid-icons/tb";
import { Button } from "~/components/ui/button";
import { $mainInput, addTimeline } from "./atoms";
import MainInput from "./MainInput";

export default () => {
  const mainInput = useStore($mainInput);
  return (
    <form
      class="flex-1"
      onSubmit={(event) => {
        event.preventDefault();

        addTimeline(mainInput());
        $mainInput.set("");
      }}
    >
      <div class="flex gap-2">
        <MainInput />
        <div class="group relative">
          <Button size="icon" variant="ghost">
            <TbCirclePlus class="h-[1.6rem] w-[1.6rem]" />
          </Button>
          <div class="absolute right-0 top-12 z-50 w-max rounded-md border border-border bg-background px-3 py-1.5 text-center text-sm opacity-0 shadow-md transition-opacity duration-200 ease-in-out group-hover:opacity-100 xl:translate-x-1/3">
            Add timeline
          </div>
        </div>
      </div>
    </form>
  );
};
