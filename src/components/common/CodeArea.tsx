import { OverlayScrollbarsComponent } from "overlayscrollbars-solid";
import { JSX } from "solid-js";
import CodeCopyButton from "./CodeAreaCopyButton";

type ControlledCodeProps = {
  children: JSX.Element;
};

export default (props: ControlledCodeProps) => {
  let codeRef: HTMLDivElement | undefined;

  return (
    <div class="relative">
      <div class="mb-4 mt-6 select-none rounded-lg border bg-zinc-800 dark:bg-zinc-900">
        <OverlayScrollbarsComponent>
          <div
            ref={codeRef}
            class="ml-6 mr-10 select-all break-all rounded py-4 font-mono text-sm text-white"
          >
            {props.children}
          </div>
        </OverlayScrollbarsComponent>
      </div>
      <CodeCopyButton str={codeRef?.textContent as string} />
    </div>
  );
};
