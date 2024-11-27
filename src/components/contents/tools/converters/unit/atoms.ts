import type { UnitCategory } from "./types";
import { atom } from "nanostores";
import { units } from "./types";

export const $unit = atom<UnitCategory>(units[0]);
