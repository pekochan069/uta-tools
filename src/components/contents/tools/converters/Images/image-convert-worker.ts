import type { ConvertInput, WorkerResult } from "./types";
import { imageFormatToMimeType } from "./types";
import { convertImageFormat } from "./vips";

globalThis.addEventListener("message", async (e) => {
  const { id, file, outputType, quality, interlaced } = e.data as ConvertInput;

  const buffer = await file.arrayBuffer();
  const inputType = file.type;

  const result = await convertImageFormat(
    id,
    buffer,
    inputType,
    imageFormatToMimeType(outputType),
    quality,
    interlaced,
  );

  const msg: WorkerResult = { id, result };

  postMessage(msg);
});
