import type { BadgeProps } from "~/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import type { IconTypes } from "solid-icons";
import type { Component } from "solid-js";
import { cva } from "class-variance-authority";
import {
  TbArrowDown,
  TbArrowDownRight,
  TbArrowRight,
  TbArrowUp,
  TbArrowUpRight,
} from "solid-icons/tb";
import { splitProps } from "solid-js";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

type DeltaType = "increase" | "moderateIncrease" | "unchanged" | "moderateDecrease" | "decrease";

const badgeDeltaVariants = cva("", {
  variants: {
    variant: {
      success: "bg-success text-success-foreground hover:bg-success",
      warning: "bg-warning text-warning-foreground hover:bg-warning",
      error: "bg-error text-error-foreground hover:bg-error",
    },
  },
});
type DeltaVariant = NonNullable<VariantProps<typeof badgeDeltaVariants>["variant"]>;

const iconMap: { [key in DeltaType]: IconTypes } = {
  increase: TbArrowUp,
  moderateIncrease: TbArrowUpRight,
  unchanged: TbArrowRight,
  moderateDecrease: TbArrowDownRight,
  decrease: TbArrowDown,
};

const variantMap: { [key in DeltaType]: DeltaVariant } = {
  increase: "success",
  moderateIncrease: "success",
  unchanged: "warning",
  moderateDecrease: "error",
  decrease: "error",
};

export interface BadgeDeltaProps extends Omit<BadgeProps, "variant"> {
  deltaType: DeltaType;
}

const BadgeDelta: Component<BadgeDeltaProps> = (props) => {
  const [, rest] = splitProps(props, ["class", "children", "deltaType"]);
  const Icon = iconMap[props.deltaType];
  const variant = variantMap[props.deltaType];

  return (
    <Badge class={cn(badgeDeltaVariants({ variant }), props.class)} {...rest}>
      <span class="flex gap-1">
        <Icon class="h-4 w-4" />
        {props.children}
      </span>
    </Badge>
  );
};

export { BadgeDelta };
