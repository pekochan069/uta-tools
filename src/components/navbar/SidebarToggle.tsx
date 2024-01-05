import { RiSystemMenu2Fill } from "solid-icons/ri";
import { OverlayScrollbarsComponent } from "overlayscrollbars-solid";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { tools } from "~/lib/tools";
import { For, createSignal, onMount } from "solid-js";

export default () => {
	const pathname = new URL(window.location.href).pathname;
	const [open, setOpen] = createSignal(false);

	return (
		<div class="md:hidden md:invisible">
			<Sheet open={open()} onOpenChange={setOpen}>
				<SheetTrigger>
					<Button variant="ghost" size="icon">
						<RiSystemMenu2Fill class="w-[1.2rem] h-[1.2rem]" />
						<span class="sr-only">Toggle sidebar</span>
					</Button>
				</SheetTrigger>
				<SheetContent position="left" size="lg">
					<div class="pt-6">
						<OverlayScrollbarsComponent
							defer
							options={{ scrollbars: { autoHide: "leave" } }}
						>
							<div class="flex gap-6 h-screen flex-col">
								<For each={tools}>
									{(toolCategory) => (
										<div class="flex flex-col gap-1">
											<h4 class="font-semibold text-lg mb-2">
												{toolCategory.name}
											</h4>
											<For each={toolCategory.tools}>
												{(tool) => (
													<a
														href={tool.href}
														class="text-muted-foreground text-sm hover:text-foreground active:text-foreground data-[current-path]:text-foreground data-[current-path]:font-semibold outline-none"
														{...(pathname === tool.href
															? { "data-current-path": "" }
															: {})}
													>
														{tool.name}
													</a>
												)}
											</For>
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
