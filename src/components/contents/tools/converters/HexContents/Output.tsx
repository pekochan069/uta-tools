import { useStore } from "@nanostores/solid";
import { createEffect } from "solid-js";

import { Effect, Exit } from "effect";
import CopyButton from "~/components/common/CopyButton";
import { TextArea } from "~/components/ui/textarea";
import { execute } from "./convert";
import { input, operation, output, repeat } from "./hexAtoms";

export const HexOutput = () => {
  const $operation = useStore(operation);
  const $repeat = useStore(repeat);
  const $input = useStore(input);
  const $output = useStore(output);

  createEffect(() => {
    if ($input() === "") {
      output.set({ value: "", status: "valid" });
      return;
    }

    Effect.runPromiseExit(execute($input(), $repeat(), $operation())).then(
      (res) => {
        return Exit.mapBoth(res, {
          onFailure(e) {
            output.set({ value: e.message, status: "invalid" });
          },
          onSuccess(data) {
            output.set({ value: data, status: "valid" });
          },
        });
      },
    );
  });

  return (
    <TextArea
      id="hex-output"
      value={$output().value}
      rows="8"
      readonly
      class="select-all resize-none"
      onClick={(e) => e.currentTarget.select()}
      readOnly
      validationState={$output().status}
    />
  );
};

export const HexOutputCopyButton = () => {
  const $output = useStore(output);
  return (
    <CopyButton
      copyType="text"
      copyContent={$output().status === "valid" ? $output().value : ""}
    />
  );
};
