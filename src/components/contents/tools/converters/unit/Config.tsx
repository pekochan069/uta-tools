import { useStore } from "@nanostores/solid";
import { createEffect, createSignal } from "solid-js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { $unit } from "./atoms";
import type { UnitCategory } from "./types";
import { UnitCategory, unitTypeOptions, units } from "./types";

export function SelectUnitType() {
  const [unitType, setUnitType] = createSignal(UnitCategory.Length);
  const label = () => units.find((u) => u.category === unitType())?.label || units[0].label;

  createEffect(() => {
    $unit.set(units.find((u) => u.category === unitType()) || units[0]);
  });

  return (
    <>
      <Select
        options={unitTypeOptions}
        value={unitType()}
        onChange={(v) => {
          if (v === null) {
            setUnitType(UnitCategory.Length);
            return;
          }

          setUnitType(v);
        }}
        itemComponent={(props) => (
          <SelectItem item={props.item}>
            {units.find((v) => v.category === props.item.rawValue)?.label}
          </SelectItem>
        )}
      >
        <SelectTrigger class="w-32">
          <SelectValue<UnitCategory>>{label()}</SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
    </>
  );
}
