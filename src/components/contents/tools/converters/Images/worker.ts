import type { ConvertInput, WorkerResult } from "./types";
import { toast } from "solid-sonner";
import { PngIcoConverter } from "~/lib/png2icojs";
import { $convertQueue, $results } from "./atoms";
import ImageConvertWorker from "./image-convert-worker?worker";
import { imageFormatToExtension } from "./utils";

const workers: Worker[] = [];
const idleWorkers: number[] = [];
const tasks: ConvertInput[] = [];

const maxWorkers = 4;

for (let i = 0; i < maxWorkers; ++i) {
  const worker = new ImageConvertWorker();
  worker.onmessage = async (e) => {
    const { id, result, status, error, outputType } = e.data as WorkerResult;

    const c = $convertQueue.get().find((c) => c.id === e.data.id);

    if (c === undefined) {
      idleWorkers.push(i);
      runTask();
      return;
    }

    const fileNameParts = c.fileName.split(".");
    fileNameParts.pop();
    const fileName = `${fileNameParts.join(".")}.${imageFormatToExtension(c.outputType)}`;

    if (outputType === "ico") {
      const converter = new PngIcoConverter();
      const ico = await converter.convertAsync([
        {
          png: result,
        },
      ]);
      $results.value.push({ id, result: ico, fileName, outputType, status });
      $results.notify();
    } else {
      $results.value.push({ id, result, fileName, outputType, status });
      $results.notify();
    }
    $convertQueue.value.splice($convertQueue.value.indexOf(c), 1);
    $convertQueue.notify();
    idleWorkers.push(i);

    if (status === "error") {
      toast.error(`Failed to convert image ${fileName} [${error}]`);
    }

    runTask();
  };
  workers.push(worker);
  idleWorkers.push(i);
}

function runTask() {
  if (idleWorkers.length === 0 || tasks.length === 0) {
    return;
  }

  const task = tasks.shift()!;
  const idleWorker = idleWorkers.shift()!;
  const worker = workers[idleWorker];

  if (task.outputType === "ico") {
    worker.postMessage({ ...task, outputType: "png" });
  } else {
    worker.postMessage(task);
  }

  runTask();
}

export function createTask(input: ConvertInput) {
  tasks.push(input);
  runTask();
}
