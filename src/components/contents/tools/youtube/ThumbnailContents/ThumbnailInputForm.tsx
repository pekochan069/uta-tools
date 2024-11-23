import { useStore } from "@nanostores/solid";
import { toast } from "solid-sonner";
import ClearButton from "~/components/common/ClearButton";
import PasteButton from "~/components/common/PasteButton";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getVideoId } from "~/lib/youtube";
import * as m from "~/paraglide/messages";
import { $url, $videoId } from "./thumbnailAtoms";

export default () => {
  const url = useStore($url);
  const computedVideoId = () => getVideoId(url());

  const onSubmit = (e: Event) => {
    e.preventDefault();

    $videoId.set(computedVideoId());
  };

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <div class="flex flex-col gap-y-4">
        <Input
          rootClass="flex-1"
          class="flex-1"
          value={url()}
          onChange={(value) => $url.set(value)}
          placeholder="https://www.youtube.com/watch?v=pgXpM4l_MwI"
        />
        <div class="flex justify-end gap-4">
          <div>
            <ClearButton onClick={() => $url.set("")} />
            <PasteButton
              paste={async (item) => {
                try {
                  const data = await item.getType("text/plain");
                  const textData = await data.text();
                  $url.set(textData);
                } catch {
                  toast.error(m.tools_common_cannot_paste_msg());
                  return;
                }
              }}
            />
          </div>
          <Button type="submit">{m.tools_common_get()}</Button>
        </div>
      </div>
    </form>
  );
};
