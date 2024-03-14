import { TbX } from "solid-icons/tb";
import { Button } from "~/components/ui/button";
import { setTimelines, timelines } from "./timelineAtoms";

// export default () => {
//   return (
//     <div class="group relative">
//       <Button
//         size="icon"
//         variant="ghost"
//         onClick={() => {
//           setTimelines(timelines.filter((timeline) => !timeline.checked));
//         }}
//         class="text-foreground hover:bg-foreground hover:text-background active:bg-foreground active:text-background"
//       >
//         <TbX class="h-[1.2rem] w-[1.2rem]" />
//       </Button>
//       <div class="absolute top-12 z-50 w-max -translate-x-1/4 rounded-md border border-border bg-background px-3 py-1.5 text-center text-sm opacity-0 shadow-md transition-opacity duration-200 ease-in-out group-hover:opacity-100">
//         Remove Selected
//       </div>
//     </div>
//   );
// };
