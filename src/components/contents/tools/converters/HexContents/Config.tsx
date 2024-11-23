import { useStore } from "@nanostores/solid";
import { TbMinus, TbPlus } from "solid-icons/tb";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { operation, repeat } from "./hexAtoms";

export const Operation = () => {
  const $operation = useStore(operation);
  const label = () => ($operation() ? "encode" : "decode");

  return (
    <>
      <Label for="operation" class="select-none capitalize">
        {label()}
      </Label>
      <Switch id="operation" checked={$operation()} onChange={() => operation.set(!$operation())} />
    </>
  );
};

export const Repeat = () => {
  const $repeat = useStore(repeat);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          if ($repeat() > 1) {
            repeat.set($repeat() - 1);
          }
        }}
        class="h-9 w-10 md:h-10 md:w-12"
      >
        <TbMinus />
      </Button>
      <Input
        type="number"
        min="1"
        max="9"
        readOnly
        value={$repeat().toString()}
        class="h-9 w-12 text-center [appearance:textfield] md:h-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <Button
        variant="outline"
        onClick={() => {
          if ($repeat() < 9) {
            repeat.set($repeat() + 1);
          }
        }}
        class="h-9 w-10 md:h-10 md:w-12"
      >
        <TbPlus />
      </Button>
    </>
  );
};
