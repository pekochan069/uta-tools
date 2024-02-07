import { useStore } from "@nanostores/solid";
import { Effect, Exit } from "effect";
import { createEffect } from "solid-js";
import { match } from "ts-pattern";

import {
  format,
  input,
  jsonFormat,
  output,
} from "~/atoms/tools/converters/cookies";
import CopyButton from "~/components/common/CopyButton";
import { TextArea } from "~/components/ui/textarea";
import { type CookieError, jsonToNetscape, netscapeToJson } from "./convert";

export const CookiesOutput = () => {
  const $format = useStore(format);
  const $input = useStore(input);
  const $output = useStore(output);
  const $jsonFormat = useStore(jsonFormat);

  const processProgram = (
    effect: Effect.Effect<never, CookieError, string>,
  ) => {
    return Effect.runPromiseExit(effect).then((res) => {
      return Exit.mapBoth(res, {
        onFailure(e) {
          output.set({ value: e.message, status: "invalid" });
        },
        onSuccess(data) {
          output.set({ value: data, status: "valid" });
        },
      });
    });
  };

  createEffect(() => {
    if ($format().from === $format().to) {
      output.set({ value: $input(), status: "valid" });
      return;
    }

    if ($input() === "") {
      return;
    }

    match($format())
      .with({ from: "json", to: "netscape" }, () =>
        processProgram(jsonToNetscape($input())),
      )
      .with({ from: "netscape", to: "json" }, () =>
        processProgram(netscapeToJson($input(), $jsonFormat())),
      )
      .run();
  });

  return (
    <TextArea
      rows={16}
      id="cookies-output"
      value={$output().value}
      class="select-all resize-none"
      onClick={(e) => e.currentTarget.select()}
      readOnly
      validationState={$output().status}
    />
  );
};

export const CookiesOutputCopyButton = () => {
  const $output = useStore(output);

  return (
    <CopyButton
      copyType="text"
      copyContent={$output().status === "valid" ? $output().value : ""}
    />
  );
};
