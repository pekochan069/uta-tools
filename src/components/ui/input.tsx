import { TextField } from "@kobalte/core";
import type { Component, ComponentProps, JSX } from "solid-js";
import { Show, splitProps } from "solid-js";

import { cn } from "~/lib/utils";

type InputProps = Omit<ComponentProps<"input">, "onChange" | "onchange"> & {
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
};

const Input: Component<InputProps> = (props) => {
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
		"type",
		"class",
		"children",
		"labelClass",
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
			<TextField.Input
				type={props.type}
				class={cn(
					"border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					props.class,
				)}
				{...rest}
			/>
		</TextField.Root>
	);
};

export { Input };
