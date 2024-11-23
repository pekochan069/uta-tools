import { FaSolidCopy } from "solid-icons/fa";
import { toast } from "solid-sonner";
import * as m from "~/paraglide/messages";

export default (props: { str: string }) => {
  return (
    <button
      type="button"
      class="absolute right-3 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-white ring-zinc-700 transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-zinc-800"
      onClick={() => {
        if (props.str === "") return;

        const code = props.str.trim();

        try {
          void navigator.clipboard.writeText(code).then(() => {
            toast(m.tools_common_copy_msg());
          });
        } catch {
          toast(m.tools_common_copy_fail_msg());
        }
      }}
    >
      <FaSolidCopy class="h-4 w-4" />
    </button>
  );
};
