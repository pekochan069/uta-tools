import { FaSolidLaptop } from "solid-icons/fa";
import { TbMoon, TbSun } from "solid-icons/tb";
import { createEffect, createSignal, onMount } from "solid-js";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import * as m from "~/paraglide/messages";

export default () => {
  const [theme, setTheme] = createSignal<"light" | "dark" | "system">("light");

  onMount(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setTheme(isDarkMode ? "dark" : "light");
  });

  createEffect(() => {
    const isDark =
      theme() === "dark" ||
      (theme() === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
  });

  return (
    <Tooltip>
      <TooltipTrigger>
        <DropdownMenu>
          <DropdownMenuTrigger as={Button} variant="ghost" size="icon">
            <TbSun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <TbMoon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span class="sr-only">{m.navbar_toggle_theme()}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={() => {
                setTheme("light");
              }}
            >
              <TbSun class="mr-2 h-4 w-4" />
              <span>{m.navbar_toggle_theme_light()}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setTheme("dark");
              }}
            >
              <TbMoon class="mr-2 h-4 w-4" />
              <span>{m.navbar_toggle_theme_dark()}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setTheme("system");
              }}
            >
              <FaSolidLaptop class="mr-2 h-4 w-4" />
              <span>{m.navbar_toggle_theme_system()}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipTrigger>
      <TooltipContent>{m.navbar_toggle_theme()}</TooltipContent>
    </Tooltip>
  );
};
