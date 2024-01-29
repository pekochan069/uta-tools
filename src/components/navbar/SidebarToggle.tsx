import { For, createSignal } from "solid-js";
import { RiSystemMenu2Fill } from "solid-icons/ri";
import { OverlayScrollbarsComponent } from "overlayscrollbars-solid";

import { contents } from "~/lib/contents/contents";
import { tools } from "~/lib/contents/tools";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/ui/tooltip";

export default () => {
	const pathname = new URL(window.location.href).pathname;
	const [open, setOpen] = createSignal(false);

	return (
		<div class="md:hidden md:invisible">
			<Sheet open={open()} onOpenChange={setOpen}>
				<SheetTrigger>
					<Tooltip>
						<TooltipTrigger>
							<Button variant="ghost" size="icon">
								<RiSystemMenu2Fill class="w-[1.2rem] h-[1.2rem]" />
								<span class="sr-only">Toggle sidebar</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>Toggle sidebar</TooltipContent>
					</Tooltip>
				</SheetTrigger>
				<SheetContent position="left" size="lg">
					<div class="pt-6">
						<OverlayScrollbarsComponent defer options={{ scrollbars: { autoHide: "leave" } }}>
							<div class="flex h-[calc(100svh-7rem)] flex-col gap-10">
								<For each={contents}>
									{(largeCategory) => (
										<div class="flex flex-col gap-1">
											<h3 class="mb-2 text-2xl font-semibold">{largeCategory.name}</h3>
											<div class="flex flex-col gap-4">
												<For each={largeCategory.categories}>
													{(category) => (
														<div class="flex flex-col gap-1">
															<h4 class="mb-1 text-lg font-semibold">{category.name}</h4>
															<For each={category.contents}>
																{(content) => (
																	<a
																		href={content.href}
																		class="text-sm text-muted-foreground hover:text-foreground active:text-foreground data-[current-path]:font-semibold data-[current-path]:text-foreground data-[current-path]:underline"
																		{...(pathname === content.href
																			? { "data-current-path": "" }
																			: {})}
																	>
																		{content.name}
																	</a>
																)}
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
