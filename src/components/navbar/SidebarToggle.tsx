import { OverlayScrollbarsComponent } from "overlayscrollbars-solid";
import { RiSystemMenu2Fill } from "solid-icons/ri";
import { createSignal, For } from "solid-js";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { collections } from "~/lib/contents";

export default () => {
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
                <span class="sr-only">Toggle sidebar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle sidebar</TooltipContent>
          </Tooltip>
        </SheetTrigger>
        <SheetContent position="left">
          <div class="pt-6">
            <OverlayScrollbarsComponent defer options={{ scrollbars: { autoHide: "leave" } }}>
              <div class="flex h-[calc(100svh-7rem)] flex-col gap-10">
                <For each={collections}>
                  {(collections) => (
                    <div class="flex flex-col gap-1">
                      <h3 class="mb-2 text-2xl font-semibold">{collections.name}</h3>
                      <div class="flex flex-col gap-4">
                        <For each={collections.categories}>
                          {(category) => (
                            <div class="flex flex-col gap-1">
                              <h4 class="mb-1 text-lg font-semibold">{category.name}</h4>
                              <For each={category.contents}>
                                {(content) => {
                                  const href = `/${collections.slug}/${category.slug}/${content.slug}`;
                                  return (
                                    <a
                                      href={href}
                                      class="text-sm text-muted-foreground hover:text-foreground active:text-foreground data-[current-path]:font-semibold data-[current-path]:text-foreground data-[current-path]:underline"
                                      {...(pathname === href ? { "data-current-path": "" } : {})}
                                    >
                                      {content.name}
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
