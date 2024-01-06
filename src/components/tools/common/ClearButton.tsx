import { type JSX } from "solid-js";
import { VsClearAll } from "solid-icons/vs";
import { Button } from "~/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";

export default (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => {
	return (
		<Tooltip>
			<TooltipTrigger>
				<Button size="icon" variant="ghost" {...props}>
					<VsClearAll class="w-[1.2rem] h-[1.2rem]" />
				</Button>
			</TooltipTrigger>
			<TooltipContent>Clear</TooltipContent>
		</Tooltip>
	);
};
