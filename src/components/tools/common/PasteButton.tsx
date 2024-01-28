import { type JSX } from "solid-js";
import { FaSolidPaste } from "solid-icons/fa";

import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";

type PasteButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	paste: (item: ClipboardItem) => Promise<void>;
	tooltip?: string;
};

export default (props: PasteButtonProps) => {
	const paste = async () => {
		let item;
		try {
			item = await navigator.clipboard.read();
		} catch {
			return;
		}

		props.paste(item[0]);
	};

	return (
		<Tooltip>
			<TooltipTrigger>
				<Button
					onClick={() => {
						paste();
					}}
					size="icon"
					variant="ghost"
					{...props}
				>
					<FaSolidPaste class="w-[1.2rem] h-[1.2rem]" />
				</Button>
			</TooltipTrigger>
			<TooltipContent>{props.tooltip ? props.tooltip : "Paste"}</TooltipContent>
		</Tooltip>
	);
};
