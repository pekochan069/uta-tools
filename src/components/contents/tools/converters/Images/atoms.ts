import type {
  ConvertInput,
  ConvertQueueItem,
  ImageFormat,
  ImageQueueItem,
  ItemId,
  ResultItem,
} from "./types";
import { atom } from "nanostores";
import { toast } from "solid-sonner";
import { createId } from "~/lib/nanoid";
import { mimeTypeToImageFormat } from "./types";

export const $imagesQueue = atom<ImageQueueItem[]>([]);

export function addImage(file: File) {
  $imagesQueue.value.push({ id: createId(), file });
}

export function addImages(files: FileList) {
  const items = Array.from(files).map((file) => ({ id: createId(), file }));
  const filterd = items.filter((item) => {
    const mimeType = item.file.type;
    const imageFormat = mimeTypeToImageFormat(mimeType);

    if (imageFormat === "None") {
      return false;
    }

    return true;
  });

  if (filterd.length !== items.length) {
    toast.error("Some files are not supported");
  }

  $imagesQueue.value.push(...items);
  $imagesQueue.notify();
}

export function removeImage(id: ItemId) {
  $imagesQueue.set($imagesQueue.get().filter((item) => item.id !== id));
}

export const $batchFormat = atom<ImageFormat>("None");

export const $convertQueue = atom<ConvertQueueItem[]>([]);

export const $results = atom<ResultItem[]>([]);
