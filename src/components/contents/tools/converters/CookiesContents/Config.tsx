import { useStore } from "@nanostores/solid";

import {
  type CookieFormat,
  format,
  jsonFormat,
} from "~/atoms/tools/converters/cookies";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const From = () => {
  const $format = useStore(format);

  return (
    <Select
      value={$format().from}
      onChange={(value) => {
        if (value === null) return;

        format.set({
          ...$format(),
          from: value,
        });
      }}
      options={["json", "netscape"]}
      itemComponent={(props) => (
        <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
      )}
    >
      <SelectTrigger class="w-32">
        <SelectValue<CookieFormat>>
          {(state) => state.selectedOption()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
};

export const To = () => {
  const $format = useStore(format);

  return (
    <Select
      value={$format().to}
      onChange={(value) =>
        format.set({
          ...$format(),
          to: value,
        })
      }
      options={["json", "netscape"]}
      itemComponent={(props) => (
        <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
      )}
    >
      <SelectTrigger class="w-32">
        <SelectValue<CookieFormat>>
          {(state) => state.selectedOption()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
};

export const JSONFormat = () => {
  const $jsonFormat = useStore(jsonFormat);

  return (
    <Select
      value={$jsonFormat()}
      onChange={(value) => jsonFormat.set(value)}
      options={["pretty", "minify"]}
      itemComponent={(props) => (
        <SelectItem item={props.item} class="capitalize">
          {props.item.rawValue}
        </SelectItem>
      )}
    >
      <SelectTrigger class="w-32 capitalize">
        <SelectValue<CookieFormat>>
          {(state) => state.selectedOption()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
};
