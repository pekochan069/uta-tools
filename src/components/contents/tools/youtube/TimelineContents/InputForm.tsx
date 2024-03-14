import { useStore } from "@nanostores/solid";
import { batch } from "solid-js";
import AddTimelineButton from "./AddTimelineButton";
import MainInput from "./MainInput";
import { addTimeline, mainInput } from "./timelineAtoms";

export default () => {
  const $mainInput = useStore(mainInput);
  return (
    <form
      class="flex-1"
      onSubmit={(event) => {
        event.preventDefault();

        batch(() => {
          addTimeline($mainInput());
          mainInput.set("");
        });
      }}
    >
      <div class="flex gap-2">
        <MainInput />
        <AddTimelineButton />
      </div>
    </form>
  );
};
