import { createSortable, transformStyle, useDragDropContext } from "@thisbeyond/solid-dnd";
import type { TimelineType } from "./timelineTypes";
import { TableCell, TableRow } from "~/components/ui/table";
import { Checkbox } from "~/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Input } from "~/components/ui/input";
import ClearButton from "~/components/tools/common/ClearButton";
import PasteButton from "~/components/tools/common/PasteButton";
import { toast } from "solid-sonner";
import CopyButton from "~/components/tools/common/CopyButton";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { TbDotsVertical, TbX } from "solid-icons/tb";

type TimelineRowProps = {
	item: TimelineType;
	setChecked: (checked: boolean) => void;
	onTimeChange: (type: "hour" | "minute" | "second", value: string) => void;
	onTimelineChange: (value: string) => void;
	deleteTimeline: () => void;
};

export default (props: TimelineRowProps) => {
	const sortable = createSortable(props.item.id);
	const [state] = useDragDropContext();

	return (
		<TableRow
			ref={sortable.ref}
			classList={{
				"opacity-25": sortable.isActiveDraggable,
				"transition-transform": !!state.active.draggable,
			}}
			class="sortable"
			style={transformStyle(sortable.transform)}
		>
			<TableCell class="w-4 md:w-8 py-2 pl-0 pr-4 md:p-4 hidden invisible sm:table-cell sm:visible">
				<Checkbox
					checked={props.item.checked}
					onChange={() => props.setChecked(!props.item.checked)}
				/>
			</TableCell>
			<TableCell class="w-[5.5rem] py-2 sm:pl-0 pr-4 md:p-4">
				<Popover>
					<PopoverTrigger>{props.item.formattedTime}</PopoverTrigger>
					<PopoverContent>
						<div class="grid grid-cols-3 gap-2">
							<Input
								value={props.item.time[0].toString()}
								onChange={(value) => props.onTimeChange("hour", value)}
								type="number"
								min={0}
								max={99}
								labelClass="text-sm"
							>
								Hour
							</Input>
							<Input
								value={props.item.time[1].toString()}
								onChange={(value) => props.onTimeChange("minute", value)}
								type="number"
								min={0}
								max={59}
								labelClass="text-sm"
							>
								Minutes
							</Input>
							<Input
								value={props.item.time[2].toString()}
								onChange={(value) => props.onTimeChange("second", value)}
								type="number"
								min={0}
								max={59}
								labelClass="text-sm"
							>
								Seconds
							</Input>
						</div>
					</PopoverContent>
				</Popover>
			</TableCell>
			<TableCell class="p-2 pl-0 md:p-4">
				<div class="flex gap-2 md:gap-4">
					<Input
						rootClass="flex-1"
						type="text"
						value={props.item.text}
						onChange={(value) => props.onTimelineChange(value)}
					/>
					<div class="flex xl:gap-2">
						<ClearButton
							onClick={() => props.onTimelineChange("")}
							class="hidden invisible xl:flex xl:visible hover:bg-foreground active:bg-foreground hover:text-background active:text-background"
						/>
						<PasteButton
							paste={async (pasteItem) => {
								try {
									const data = await pasteItem.getType("text/plain");
									const textData = await data.text();
									props.onTimelineChange(textData);
								} catch {
									toast.error("Cannot paste text from clipboard");
									return;
								}
							}}
							class="hidden invisible xl:flex xl:visible hover:bg-foreground active:bg-foreground hover:text-background active:text-background"
						/>
						<CopyButton
							copyType="text"
							copyContent={`${props.item.formattedTime} ${props.item.text}`}
							class="hidden invisible xl:flex xl:visible hover:bg-foreground active:bg-foreground hover:text-background active:text-background"
						/>
						<Tooltip>
							<TooltipTrigger>
								<Button
									size="icon"
									variant="ghost"
									onClick={() => props.deleteTimeline()}
									class="hover:bg-foreground active:bg-foreground hover:text-background active:text-background"
								>
									<TbX class="w-[1.2rem] h-[1.2rem]" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Remove</TooltipContent>
						</Tooltip>
					</div>
				</div>
			</TableCell>
			<TableCell class="w-6 md:w-8 p-0 hidden invisible sm:table-cell sm:visible">
				<div class="grid place-content-center text-muted-foreground hover:text-foreground" {...sortable.dragActivators}>
					<TbDotsVertical class="w-6 h-6" />
				</div>
			</TableCell>
		</TableRow>
	);
};
