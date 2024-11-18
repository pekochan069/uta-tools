import type { Component, ComponentProps, JSX } from "solid-js";
import { TextField } from "@kobalte/core";
import { Show, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

// const Textarea: Component<ComponentProps<"textarea">> = (props) => {
//   const [, rest] = splitProps(props, ["class"]);
//   return (
//     <textarea
//       class={cn(
//         "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//         props.class,
//       )}
//       {...rest}
//     />
//   );
// };

// export { Textarea };

type TextAreaProps = Omit<ComponentProps<"textarea">, "onChange" | "onchange"> & {
  rootClass?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  validationState?: "valid" | "invalid";
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  children?: JSX.Element;
  labelClass?: string;
  errorMessage?: string;
};

const TextArea: Component<TextAreaProps> = (props) => {
  const [, rest] = splitProps(props, [
    "rootClass",
    "value",
    "defaultValue",
    "onChange",
    "name",
    "validationState",
    "required",
    "disabled",
    "readOnly",
    "class",
    "children",
    "labelClass",
    "errorMessage",
  ]);

  return (
    <TextField.Root
      class={props.rootClass}
      value={props.value}
      defaultValue={props.defaultValue}
      onChange={props.onChange}
      name={props.name}
      validationState={props.validationState}
      required={props.required}
      disabled={props.disabled}
      readOnly={props.readOnly}
    >
      <Show when={props.children}>
        <TextField.Label
          class={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            props.labelClass,
          )}
        >
          {props.children}
        </TextField.Label>
      </Show>
      {/* @ts-ignore */}
      <TextField.TextArea
        class={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ui-invalid:border-destructive ui-invalid:text-destructive",
          props.class,
        )}
        {...rest}
      />
      <Show when={props.errorMessage}>
        <TextField.ErrorMessage class="text-sm font-medium text-destructive">
          {props.errorMessage}
        </TextField.ErrorMessage>
      </Show>
    </TextField.Root>
  );
};

export { TextArea };
