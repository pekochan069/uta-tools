import { type JSX } from "solid-js";

import { cn } from "~/lib/utils";

export const ContentConfigSection = (props: { children: JSX.Element }) => {
  return <div class="flex flex-col gap-y-4">{props.children}</div>;
};
export const ContentConfigRoot = (props: {
  children: JSX.Element;
  class?: string;
}) => {
  return (
    <div
      class={cn("flex items-center rounded-lg border-[1px] p-4", props.class)}
    >
      {props.children}
    </div>
  );
};

export const ContentConfigLabel = (props: {
  name: string;
  description?: string;
  class?: string;
}) => {
  return (
    <div class={cn("flex flex-1 flex-col", props.class)}>
      <div class="font-semibold">{props.name}</div>
      {props.description && (
        <div class="hidden text-sm text-muted-foreground lg:block">
          {props.description}
        </div>
      )}
    </div>
  );
};

export const ContentConfig = (props: {
  children: JSX.Element;
  class?: string;
}) => {
  return (
    <div class={cn("flex-0 flex items-center gap-2", props.class)}>
      {props.children}
    </div>
  );
};
