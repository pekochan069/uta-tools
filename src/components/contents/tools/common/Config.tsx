import { type JSX } from "solid-js";

export const ToolConfigSection = (props: { children: JSX.Element }) => {
	return <div class="flex flex-col gap-y-4">{props.children}</div>;
};
export const ToolConfigRoot = (props: { children: JSX.Element }) => {
	return (
		<div class="p-4 border-[1px] flex items-center rounded-lg">
			{props.children}
		</div>
	);
};

export const ToolConfigLabel = (props: {
	tool: string;
	description?: string;
}) => {
	return (
		<div class="flex-1 flex flex-col">
			<div class="font-semibold">{props.tool}</div>
			{props.description && (
				<div class="hidden lg:block text-sm text-muted-foreground">
					{props.description}
				</div>
			)}
		</div>
	);
};

export const ToolConfig = (props: { children: JSX.Element }) => {
	return <div class="flex-0 flex gap-2 items-center">{props.children}</div>;
};
