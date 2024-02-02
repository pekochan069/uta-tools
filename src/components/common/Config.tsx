import { type JSX } from "solid-js";

export const ContentConfigSection = (props: { children: JSX.Element }) => {
  return <div class="flex flex-col gap-y-4">{props.children}</div>;
};
export const ContentConfigRoot = (props: { children: JSX.Element }) => {
  return (
    <div class="flex items-center rounded-lg border-[1px] p-4">
      {props.children}
    </div>
  );
};

export const ContentConfigLabel = (props: {
  name: string;
  description?: string;
}) => {
  return (
    <div class="flex flex-1 flex-col">
      <div class="font-semibold">{props.name}</div>
      {props.description && (
        <div class="hidden text-sm text-muted-foreground lg:block">
          {props.description}
        </div>
      )}
    </div>
  );
};

export const ContentConfig = (props: { children: JSX.Element }) => {
  return <div class="flex-0 flex items-center gap-2">{props.children}</div>;
};
