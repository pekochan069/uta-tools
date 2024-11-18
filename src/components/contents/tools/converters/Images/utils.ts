import type { ImageFormat } from "./types";

/**
 * Determines whether a given file type supports a quality setting,
 *
 * @todo Make this smarter.
 *
 * @param type Mime type.
 * @return Whether the file supports a quality setting.
 */
export function supportsQuality(
  type: string,
): type is "image/jpeg" | "image/png" | "image/webp" | "image/avif" {
  return ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(type);
}

/**
 * Determines whether a given file type supports animation,
 *
 * @todo Make this smarter.
 *
 * @param type Mime type.
 * @return Whether the file supports animation.
 */
export function supportsAnimation(type: string): type is "image/webp" | "image/gif" {
  return ["image/webp", "image/gif"].includes(type);
}

/**
 * Determines whether a given file type supports interlaced/progressive output.
 *
 * @todo Make this smarter.
 *
 * @param type Mime type.
 * @return Whether the file supports interlaced/progressive output.
 */
export function supportsInterlace(type: string): type is "image/jpeg" | "image/gif" | "image/png" {
  return ["image/jpeg", "image/gif", "image/png"].includes(type);
}

export const availableFormats: ImageFormat[] = [
  "None",
  "jpeg",
  "png",
  "webp",
  "heif",
  "avif",
  "jpeg-xl",
  "tiff",
  "gif",
  "ico",
  //"svg",
];

export function imageFormatToMimeType(format: ImageFormat): string {
  switch (format) {
    case "jpeg":
      return "image/jpeg";
    case "jpeg2000":
      return "image/jp2";
    case "jpeg-xl":
      return "image/jxl";
    case "tiff":
      return "image/tiff";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
    case "fits":
      return "image/fits";
    case "pdf":
      return "application/pdf";
    case "svg":
      return "image/svg+xml";
    case "ppm":
      return "image/x-portable-pixmap";
    case "ico":
      return "image/x-icon";
    case "heif":
      return "image/heif";
    case "gif":
      return "image/gif";
    case "None":
      return "*";
  }
}

export function mimeTypeToImageFormat(type: string): ImageFormat {
  switch (type) {
    case "image/jpg":
    case "image/jpeg":
      return "jpeg";
    case "image/jp2":
    case "image/jpeg2000":
    case "image/jpx":
    case "image/jpm":
      return "jpeg2000";
    case "image/jxl":
      return "jpeg-xl";
    case "image/tiff":
    case "image/tif":
    case "image/tiff-fx":
      return "tiff";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    case "image/fits":
      return "fits";
    case "application/pdf":
      return "pdf";
    case "image/svg+xml":
    case "image/svg":
      return "svg";
    case "image/x-portable-pixmap":
    case "image/x-portable-graymap":
    case "image/x-portable-floatmap":
    case "image/x-portable-bitmap":
    case "image/x-portable-anymap":
    case "image/x-ppm":
    case "image/x-pgm":
    case "image/x-pfm":
    case "image/x-pbm":
    case "image/x-pnm":
    case "image/x-p":
      return "ppm";
    case "image/gif":
      return "gif";
    case "image/heif":
    case "image/heic":
      return "heif";
    case "image/x-icon":
    case "image/ico":
    case "image/vnd.microsoft.icon":
    case "image/icon":
      return "ico";
    default:
      // return type.split("/")[1];
      return "None";
  }
}

export function imageFormatToExtension(format: ImageFormat): string {
  switch (format) {
    case "jpeg":
      return "jpg";
    case "jpeg2000":
      return "jp2";
    case "jpeg-xl":
      return "jxl";
    case "tiff":
      return "tiff";
    case "png":
      return "png";
    case "webp":
      return "webp";
    case "avif":
      return "avif";
    case "fits":
      return "fits";
    case "pdf":
      return "pdf";
    case "svg":
      return "svg";
    case "ppm":
      return "ppm";
    case "ico":
      return "ico";
    case "heif":
      return "heif";
    case "gif":
      return "gif";
    case "None":
      return "None";
  }
}

export const accept = "image/*,image/heif,image/heic,application/pdf";
