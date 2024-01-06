import { type JSX } from "solid-js";
import { FaSolidCopy } from "solid-icons/fa";
import { Button } from "~/components/ui/button";
import { toast } from "solid-sonner";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";

interface CopyButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	copyContent: any;
	copyType: "text";
}

export default (props: CopyButtonProps) => {
	const copy = () => {
		if (props.copyType === "text") {
			navigator.clipboard.writeText(props.copyContent);
		}
		toast("Copied to clipboard");
	};

	return (
		<Tooltip>
			<TooltipTrigger>
				<Button
					onClick={() => {
						copy();
					}}
					size="icon"
					variant="ghost"
					{...props}
				>
					<FaSolidCopy class="w-[1.2rem] h-[1.2rem]" />
				</Button>
			</TooltipTrigger>
			<TooltipContent>Copy</TooltipContent>
		</Tooltip>
	);
};
