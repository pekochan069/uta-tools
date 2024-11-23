import { BsPersonWorkspace } from "solid-icons/bs";
import { Button } from "~/components/ui/button";

export function scrollToWorkspace() {
  const playerContainerRef = document.getElementById("player-container");

  if (playerContainerRef === null) return;

  const playerContainerStart =
    playerContainerRef.getBoundingClientRect().top + document.documentElement.scrollTop;

  window.scroll({
    top: playerContainerStart - 16,
    behavior: "smooth",
  });
}

export default () => {
  return (
    <div class="group relative">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => scrollToWorkspace()}
        class="text-foreground hover:bg-foreground hover:text-background active:bg-foreground active:text-background"
      >
        <BsPersonWorkspace class="h-[1.2rem] w-[1.2rem]" />
      </Button>
      <div class="absolute top-12 z-50 w-max -translate-x-1/4 rounded-md border border-border bg-background px-3 py-1.5 text-center text-sm opacity-0 shadow-md transition-opacity duration-200 ease-in-out group-hover:opacity-100">
        Scroll to Workspace
      </div>
    </div>
  );
};
