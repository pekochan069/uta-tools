import type { TimelineType } from "./types";
import { createSortable, transformStyle, useDragDropContext } from "@thisbeyond/solid-dnd";
import { TbDotsVertical, TbX } from "solid-icons/tb";
import { toast } from "solid-sonner";
import ClearButton from "~/components/common/ClearButton";
import CopyButton from "~/components/common/CopyButton";
import PasteButton from "~/components/common/PasteButton";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { TableCell, TableRow } from "~/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import * as m from "~/paraglide/messages";

type TimelineRowProps = {
  item: TimelineType;
  fold: boolean;
  setChecked: (checked: boolean) => void;
  onTimeChange: (type: "hour" | "minute" | "second", value: string) => void;
  onTimelineChange: (value: string) => void;
  deleteTimeline: () => void;
};

export default (props: TimelineRowProps) => {
  const sortable = createSortable(props.item.id);
  // @ts-ignore
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
      <TableCell class="w-4 py-2 pl-0 pr-4 md:w-8 md:p-4">
        <Checkbox
          checked={props.item.checked}
          onChange={() => props.setChecked(!props.item.checked)}
        />
      </TableCell>
      <TableCell class="w-[5.5rem] py-2 pr-4 sm:pl-0 md:p-4">
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
                {m.tools_common_hour()}
              </Input>
              <Input
                value={props.item.time[1].toString()}
                onChange={(value) => props.onTimeChange("minute", value)}
                type="number"
                min={0}
                max={59}
                labelClass="text-sm"
              >
                {m.tools_common_minute()}
              </Input>
              <Input
                value={props.item.time[2].toString()}
                onChange={(value) => props.onTimeChange("second", value)}
                type="number"
                min={0}
                max={59}
                labelClass="text-sm"
              >
                {m.tools_common_second()}
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
              class="invisible hidden hover:bg-foreground hover:text-background active:bg-foreground active:text-background xl:visible xl:flex"
            />
            <PasteButton
              paste={async (pasteItem) => {
                try {
                  const data = await pasteItem.getType("text/plain");
                  const textData = await data.text();
                  props.onTimelineChange(textData);
                } catch {
                  toast.error(m.tools_common_cannot_paste_msg());
                  return;
                }
              }}
              class="invisible hidden hover:bg-foreground hover:text-background active:bg-foreground active:text-background xl:visible xl:flex"
            />
            <CopyButton
              copyType="text"
              copyContent={`${props.item.formattedTime} ${props.item.text}`}
              class="invisible hidden hover:bg-foreground hover:text-background active:bg-foreground active:text-background xl:visible xl:flex"
            />
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => props.deleteTimeline()}
                  class="hover:bg-foreground hover:text-background active:bg-foreground active:text-background"
                >
                  <TbX class="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{m.tools_common_remove()}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TableCell>
      <TableCell class="invisible hidden w-6 p-0 sm:visible sm:table-cell md:w-8">
        <div
          data-fold={props.fold ? "fold" : "unfold"}
          class="grid cursor-grab place-content-center text-muted-foreground hover:text-foreground data-[disabled=true]:cursor-not-allowed data-[disabled=true]:text-muted data-[fold=fold]:text-muted"
          {...(props.fold ? {} : sortable.dragActivators)}
        >
          <TbDotsVertical class="h-6 w-6" />
        </div>
      </TableCell>
    </TableRow>
  );
};
