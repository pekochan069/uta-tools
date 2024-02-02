import { Show, onMount } from "solid-js";
import { useStore } from "@nanostores/solid";

import { showDescription } from "~/atoms/tldr";
import {
  ContentConfigSection,
  ContentConfigRoot,
  ContentConfigLabel,
  ContentConfig,
} from "~/components/common/Config";
import { Switch } from "~/components/ui/switch";

export default () => {
  const $showDescription = useStore(showDescription);

  onMount(() => {
    const s = localStorage.getItem("showDescription");
  })

  const onShowDescriptionChange = () => {
    showDescription.set(!$showDescription());
  }

  return (
    <div class="mt-4">
      <ContentConfigSection>
        <ContentConfigRoot>
          <ContentConfigLabel
            name="설명 보이기"
            description="각 항목에 대한 부가설명을 보이게 하거나 숨깁니다."
          />
          <ContentConfig>
            <label for="operation">
              <Show when={$showDescription()} fallback="숨기기">
                보이기
              </Show>
            </label>
            <Switch
              id="show-description"
              checked={$showDescription()}
              onChange={() => showDescription.set(!$showDescription())}
            />
          </ContentConfig>
        </ContentConfigRoot>
      </ContentConfigSection>
    </div>
  );
};
