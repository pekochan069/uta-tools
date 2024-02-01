import { FaSolidCopy } from "solid-icons/fa";
import { toast } from "solid-sonner";

export default (props: { str: string }) => {
  return (
    <button
      type="button"
      class="absolute right-3 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-white ring-zinc-700 transition-colors  hover:bg-zinc-700 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      onClick={() => {
        if (props.str === "") return;

        const code = props.str.trim();

        try {
          navigator.clipboard.writeText(code);
          toast("Copied text to clipboard");
        } catch {
          toast("Failed to copy text to clipboard");
        }
      }}
    >
      <FaSolidCopy class="h-4 w-4" />
    </button>
  );
};
