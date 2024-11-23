import type { Lang } from "~/i18n/utils";
import { FaSolidLaptop } from "solid-icons/fa";
import { RiEditorTranslate2 } from "solid-icons/ri";
import { TbMoon, TbSun } from "solid-icons/tb";
import { createEffect, createSignal, For, onMount } from "solid-js";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { langNames, langs } from "~/i18n/utils";
import * as m from "~/paraglide/messages";

export default (props: { lang: Lang; url: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <DropdownMenu>
          <DropdownMenuTrigger as={Button} variant="ghost" size="icon">
            <RiEditorTranslate2 class="size-5" />
            <span class="sr-only">{m.navbar_toggle_lang()}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <For each={Array.from(langs)}>
              {(lang) => (
                <DropdownMenuItem onSelect={() => {}} as="a" href={`/${lang}/${props.url}`}>
                  <span>{langNames[lang]}</span>
                </DropdownMenuItem>
              )}
            </For>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipTrigger>
      <TooltipContent>{m.navbar_toggle_theme()}</TooltipContent>
    </Tooltip>
  );
};
