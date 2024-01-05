import { splitProps, type JSX } from "solid-js";
import { FaSolidCopy } from "solid-icons/fa";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import { toast } from "solid-sonner";

interface CopyButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	copyContent: any;
	copyType: "text";
}

export default (props: CopyButtonProps) => {
	const [, rest] = splitProps(props, ["class"]);

	const copy = () => {
		if (props.copyType === "text") {
			navigator.clipboard.writeText(props.copyContent);
		}
		toast("Copied to clipboard");
	};

	return (
		<Button
			onClick={() => {
				copy();
			}}
			size="icon"
			class={cn(
				"bg-muted-foreground hover:bg-foreground active:bg-foreground",
				props.class,
			)}
			{...props}
		>
			<FaSolidCopy />
		</Button>
	);
};
