import type { ConvertInput, WorkerResult } from "./types";
import { $convertQueue, $results } from "./atoms";
import ImageConvertWorker from "./image-convert-worker?worker";
import { imageFormatToExtension, mimiTypeToExtension } from "./types";

const workers: Worker[] = [];
const idleWorkers: number[] = [];
const tasks: ConvertInput[] = [];

const maxWorkers = navigator.hardwareConcurrency || 4;

for (let i = 0; i < maxWorkers; ++i) {
  const worker = new ImageConvertWorker();
  worker.onmessage = (e) => {
    const { id, result } = e.data as WorkerResult;

    const c = $convertQueue.get().find((c) => c.id === e.data.id);

    if (c === undefined) {
      idleWorkers.push(i);
      runTask();
      return;
    }

    const fileNameParts = c.fileName.split(".");
    fileNameParts.pop();
    const fileName = `${fileNameParts.join(".")}.${imageFormatToExtension(c.outputType)}`;

    $results.value.push({ id, result, fileName, type: c.outputType });
    $results.notify();
    $convertQueue.value.splice($convertQueue.value.indexOf(c), 1);
    $convertQueue.notify();
    idleWorkers.push(i);
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

  worker.postMessage(task);

  runTask();
}

export function createTask(input: ConvertInput) {
  tasks.push(input);
  runTask();
}
