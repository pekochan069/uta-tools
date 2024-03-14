import { useStore } from "@nanostores/solid";

import { Input } from "~/components/ui/input";
import { checkUrl } from "~/lib/youtube";
import { mainInput, player } from "./timelineAtoms";
import { url } from "./timelineAtoms";

export default () => {
  const $player = useStore(player);
  const $mainInput = useStore(mainInput);

  return (
    <Input
      value={$mainInput()}
      onChange={(value) => {
        if ($player() === undefined) {
          if (checkUrl(value)) {
            url.set(value);
          }

          return;
        }

        mainInput.set(value);
      }}
      placeholder="Ado / Show"
      rootClass="flex-1"
    />
  );
};
