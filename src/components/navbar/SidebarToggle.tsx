import type { Lang } from "~/i18n/utils";
import { OverlayScrollbarsComponent } from "overlayscrollbars-solid";
import { RiSystemMenu2Fill } from "solid-icons/ri";
import { createSignal, For } from "solid-js";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { collections } from "~/lib/contents";
import * as m from "~/paraglide/messages";

export default (props: { lang: Lang }) => {
  const pathname = new URL(window.location.href).pathname;
  const [open, setOpen] = createSignal(false);

  return (
    <div class="md:invisible md:hidden">
      <Sheet open={open()} onOpenChange={setOpen}>
        <SheetTrigger>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="icon">
                <RiSystemMenu2Fill class="h-[1.2rem] w-[1.2rem]" />
                <span class="sr-only">{m.navbar_toggle_sidebar()}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{m.navbar_toggle_sidebar()}</TooltipContent>
          </Tooltip>
        </SheetTrigger>
        <SheetContent position="left">
          <div class="pt-6">
            <OverlayScrollbarsComponent defer options={{ scrollbars: { autoHide: "leave" } }}>
              <div class="flex h-[calc(100svh-7rem)] flex-col gap-10">
                <For each={collections}>
                  {(collections) => (
                    <div class="flex flex-col gap-1">
                      <h3 class="mb-2 text-2xl font-semibold">{collections.i18n[props.lang]}</h3>
                      <div class="flex flex-col gap-4">
                        <For each={collections.categories}>
                          {(category) => (
                            <div class="flex flex-col gap-1">
                              <h4 class="mb-1 text-lg font-semibold">
                                {category.i18n[props.lang]}
                              </h4>
                              <For each={category.contents}>
                                {(content) => {
                                  const href = `/${props.lang}/${collections.slug}/${category.slug}/${content.slug}`;
                                  return (
                                    <a
                                      href={href}
                                      class="text-sm text-muted-foreground hover:text-foreground active:text-foreground data-[current-path]:font-semibold data-[current-path]:text-foreground data-[current-path]:underline"
                                      {...(pathname === href ? { "data-current-path": "" } : {})}
                                    >
                                      {content.i18n[props.lang]}
                                    </a>
                                  );
                                }}
                              </For>
                            </div>
                          )}
                        </For>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </OverlayScrollbarsComponent>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
