import type { JSX } from "solid-js";
import { OverlayScrollbarsComponent } from "overlayscrollbars-solid";

const ScrollArea = (props: { children: JSX.Element }) => {
  return <OverlayScrollbarsComponent defer>{props.children}</OverlayScrollbarsComponent>;
};
