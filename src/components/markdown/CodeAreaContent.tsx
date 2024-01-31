import { FaSolidCopy } from "solid-icons/fa";
import type { ParentComponent } from "solid-js";
import { toast } from "solid-sonner";

import CodeCopyButton from "./CodeCopyButton";

const CodeAreaContent: ParentComponent = (props) => {
  return (
    <>
      <code class="select-all rounded py-[0.2rem] font-mono text-sm">
        {props.children}
      </code>
      {/* @ts-ignore */}
      <CodeCopyButton str={props.children?.textContent} />
    </>
  );
};

export default CodeAreaContent;
