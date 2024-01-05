import { OverlayScrollbarsComponent } from "overlayscrollbars-solid";
import type { JSX } from "solid-js";

const ScrollArea = (props: { children: JSX.Element }) => {
    return (
    <OverlayScrollbarsComponent defer>
      {props.children}
    </OverlayScrollbarsComponent>
  ); 
}