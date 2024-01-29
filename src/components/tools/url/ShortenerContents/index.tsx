import { Match, Show, Suspense, Switch, createResource, createSignal } from "solid-js";
import { match, P } from "ts-pattern";
import { Spinner, SpinnerType } from "solid-spinner";
import { toast } from "solid-sonner";

import { trpc } from "~/lib/trpc";
import { Err, Ok, type Left } from "~/lib/types";
import ClearButton from "~/components/tools/common/ClearButton";
import CopyButton from "~/components/tools/common/CopyButton";
import PasteButton from "~/components/tools/common/PasteButton";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { Skeleton } from "~/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Label } from "~/components/ui/label";

const createLink = async (url: string) => {
	if (url === "") {
		return Err<string, string>("No URL provided");
	}

	const result = await trpc.createLink.mutate(url);
	return match(result)
		.with({ ok: true, value: P.string }, ({ value }) =>
			Ok<string, string>(`https://utaurl.vercel.app/${value}`),
		)
		.with(
			{
				ok: false,
				error: {
					message: P.string,
				},
			},
			({ error }) => Err<string, string>(error.message),
		)
		.otherwise(() => Err<string, string>("Unknown error"));
};

export default () => {
	const [input, setInput] = createSignal("");
	const [url, setUrl] = createSignal("");
	const [result] = createResource(url, createLink);

	const onSetUrlButtonClick = () => {
		if (input() === "") return;
		if (result.loading) return;

		const newUrl = input().at(-1) === "/" ? input().slice(0, -1) : input();

		setUrl(newUrl);
	};

	return (
		<div class="mt-16 md:mt-20 flex flex-col mx-auto rounded-lg border px-4 pb-5 pt-3 md:px-6 md:max-w-2xl">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					onSetUrlButtonClick();
				}}
			>
				<div>
					<div class="flex justify-between items-end mb-2">
						<Label for="input" class="text-sm font-semibold">
							Enter URL
						</Label>
						<div>
							<ClearButton onClick={() => setInput("")} />
							<PasteButton
								paste={async (item) => {
									try {
										const data = await item.getType("text/plain");
										const textData = await data.text();
										setInput(textData);
									} catch {
										toast.error("Cannot paste text from clipboard");
									}
								}}
							/>
							<CopyButton copyType="text" copyContent={input()} />
						</div>
					</div>
					<Input
						id="input"
						value={input()}
						onChange={setInput}
						required
						type="url"
						placeholder="https://youtu.be/pgXpM4l_MwI"
					/>
				</div>
				<div class="flex justify-end mt-4">
					<Tooltip>
						<TooltipTrigger>
							<Button type="submit">
								<Show when={result.loading} fallback={<span>Create</span>}>
									<Spinner type={SpinnerType.puff} />
								</Show>
							</Button>
						</TooltipTrigger>
						<TooltipContent>Click to create a short link</TooltipContent>
					</Tooltip>
				</div>
			</form>
			<div class="mt-16">
				<Show
					when={url() !== ""}
					fallback={
						<Alert class="h-[78px] flex items-center text-lg text-muted-foreground">
							Shortened URL will appear hear
						</Alert>
					}
				>
					<Suspense
						fallback={
							<Alert class="h-[78px]">
								<Skeleton class="h-10 w-full m-0 p-0" />
							</Alert>
						}
					>
						<Switch>
							<Match when={result()?.isOk()}>
								<Alert>
									<AlertTitle>
										<div class="flex justify-between items-center w-full">
											<a
												href={result()?.unwrap()}
												class="text-lg text-blue-600 hover:underline selection:bg-blue-500 selection:text-white underline-offset-2 dark:text-blue-500 dark:selection:bg-blue-600"
											>
												{result()?.unwrap()}
											</a>
											<CopyButton copyType="text" copyContent={result()?.unwrap() ?? ""} />
										</div>
									</AlertTitle>
								</Alert>
							</Match>
							<Match when={result()?.isErr()}>
								<Alert variant="destructive" class="h-[78px]">
									<AlertTitle class="font-bold tracking-wide">Error!</AlertTitle>
									<AlertDescription>
										<div>{(result() as Left<string, string>)?.error}</div>
									</AlertDescription>
								</Alert>
							</Match>
						</Switch>
					</Suspense>
				</Show>
			</div>
		</div>
	);
};
