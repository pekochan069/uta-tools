import {
  Match,
  Show,
  Suspense,
  Switch,
  createResource,
  createSignal,
} from "solid-js";
import { toast } from "solid-sonner";
import { Spinner, SpinnerType } from "solid-spinner";
import { P, match } from "ts-pattern";

import ClearButton from "~/components/common/ClearButton";
import CopyButton from "~/components/common/CopyButton";
import PasteButton from "~/components/common/PasteButton";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { trpc } from "~/lib/trpc";
import { Err, Ok } from "~/lib/types";

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
    <div class="mx-auto mt-16 flex flex-col rounded-lg border px-4 pb-5 pt-3 md:mt-20 md:max-w-2xl md:px-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSetUrlButtonClick();
        }}
      >
        <div>
          <div class="mb-2 flex items-end justify-between">
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
        <div class="mt-4 flex justify-end">
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
      <div class="mt-4">
        <Show
          when={url() !== ""}
          fallback={
            <Alert class="mt-12 flex h-[78px] items-center text-lg text-muted-foreground">
              Shortened URL will appear hear
            </Alert>
          }
        >
          <Suspense
            fallback={
              <Alert class="mt-10 flex h-[78px] items-center">
                <Skeleton class="m-0 h-10 w-full p-0" />
              </Alert>
            }
          >
            <Switch>
              <Match when={result()?.isOk()}>
                <div class="flex flex-col">
                  <div class="mb-2 flex items-end justify-between">
                    <span class="text-sm">Shortened URL</span>
                    <CopyButton
                      copyType="text"
                      copyContent={result()?.unwrap() ?? ""}
                    />
                  </div>
                  <Alert>
                    <AlertTitle>
                      <div class="flex w-full items-center justify-between">
                        <a
                          href={result()?.unwrap()}
                          target="_blank"
                          rel="noreferrer"
                          class="text-lg text-blue-600 underline-offset-2 selection:bg-blue-500 selection:text-white hover:underline dark:text-blue-500 dark:selection:bg-blue-600"
                        >
                          {result()?.unwrap()}
                        </a>
                      </div>
                    </AlertTitle>
                  </Alert>
                </div>
              </Match>
              <Match when={result()?.isErr()}>
                <Alert variant="destructive" class="mt-12 h-[78px]">
                  <AlertTitle class="font-bold tracking-wide">
                    Error!
                  </AlertTitle>
                  <AlertDescription>
                    <div>{(result() as Err<string, string>)?.error}</div>
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
