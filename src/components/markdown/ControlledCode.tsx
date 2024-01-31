import { JSX } from "solid-js";
import CodeCopyButton from "./CodeCopyButton";
import { OverlayScrollbarsComponent } from "overlayscrollbars-solid";

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
            class="ml-6 mr-10 select-all rounded py-4 font-mono text-sm text-white break-all"
          >
            {props.children}
          </div>
        </OverlayScrollbarsComponent>
      </div>
      {/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
      <CodeCopyButton str={codeRef?.textContent!} />
    </div>
  );
};
