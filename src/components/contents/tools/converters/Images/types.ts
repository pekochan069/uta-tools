import type {
  ArrayConstant,
  Enum,
  Flag,
  ForeignHeifCompression,
  ForeignHeifEncoder,
  ForeignSubsample,
} from "wasm-vips";

export type ImageFormat =
  | "ppm"
  | "svg"
  | "jpeg2000"
  | "tiff"
  | "gif"
  | "png"
  | "jpeg"
  | "webp"
  | "fits"
  | "heif"
  | "jpeg-xl"
  | "pdf"
  | "avif"
  | "ico"
  | "None";

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

export type ItemId = string;

// Same type as in @mexp/upload-media
// TODO: Move to shared package?
export interface ImageSizeCrop {
  width: number;
  height: number;
  crop?: boolean | ["left" | "center" | "right", "top" | "center" | "bottom"];
}

/**
 * none: Do nothing. Same as low.
 * centre: Just take the centre.
 * entropy: Use an entropy measure
 * attention: Look for features likely to draw human attention.
 * low: Position the crop towards the low coordinate. Same as none.
 * high: Position the crop towards the high coordinate.
 * all: Everything is interesting.
 */
type Interesting = "none" | "centre" | "entropy" | "attention" | "low" | "high" | "all";

/**
 * none: Don't attach metadata.
 * exif: Keep Exif metadata.
 * xmp: Keep XMP metadata.
 * iptc: Keep IPTC metadata.
 * icc: Keep ICC metadata.
 * other: Keep other metadata (e.g. PNG comments and some TIFF tags).
 * all: Keep all metadata.
 */
type ForeignKeep = "none" | "exif" | "xmp" | "iptc" | "icc" | "other" | "all";

/**
 * The rendering intent.'absolute' is best for
 * scientific work, 'relative' is usually best for
 * accurate communication with other imaging libraries.
 *
 * perceptual: Perceptual rendering intent.
 * relative: Relative colorimetric rendering intent.
 * saturation: Saturation rendering intent.
 * absolute: Absolute colorimetric rendering intent.
 */
type Intent = "perceptual" | "relative" | "saturation" | "absolute";

/**
 * How sensitive loaders are to errors, from never stop (very insensitive), to
 * stop on the smallest warning (very sensitive).
 *
 * Each one implies the ones before it, so 'error' implies
 * 'truncated'.
 *
 * none: Never stop.
 * truncated: Stop on image truncated, nothing else.
 * error: Stop on serious error or truncation.
 * warning: Stop on anything, even warnings.
 */
type FailOn = "none" | "truncated" | "error" | "warning";

/**
 * The type of access an operation has to supply. See vips_tilecache()
 * and #VipsForeign.
 *
 * random: means requests can come in any order.
 *
 * sequential: means requests will be top-to-bottom, but with some
 * amount of buffering behind the read point for small non-local accesses.
 */
type Access = "random" | "sequential" | "sequential-unbuffered";

export interface LoadOptions<T extends string> {
  /**
   * Number of pages to load, -1 for all.
   */
  n?: T extends "image/gif" ? number : T extends "image/webp" ? number : never;
  /**
   * Required access pattern for this file.
   */
  access?: Access;
  /**
   * Error level to fail on.
   */
  fail_on?: FailOn;
  /**
   * Don't use a cached result for this operation.
   */
  revalidate?: boolean;
}

export interface SaveOptions<T extends string> {
  /**
   * Quality factor.
   */
  Q?: T extends "image/gif" ? never : number;
  /**
   * Which metadata to retain.
   */
  keep?: ForeignKeep;
  /**
   * Generate an interlaced (progressive) JPEG/PNG/GIF.
   * Do not provide for any other type!
   */
  interlace?: boolean;
  /**
   * Enable lossless compression (for WebP).
   * Do not provide for any other type!
   */
  lossless?: T extends "image/gif" ? never : boolean;
  /**
   * CPU effort / encoding speed.
   *
   * While supported by other encoders as well,
   * it is most relevant for AVIF, as it is slow by default.
   */
  effort?: number;
}

export interface HeifSaveOptions {
  /**
   * Q factor.
   */
  Q?: number;
  /**
   * Number of bits per pixel.
   */
  bitdepth?: number;
  /**
   * Enable lossless compression.
   */
  lossless?: boolean;
  /**
   * Compression format.
   */
  compression?: ForeignHeifCompression | Enum;
  /**
   * Cpu effort.
   */
  effort?: number;
  /**
   * Select chroma subsample operation mode.
   */
  subsample_mode?: ForeignSubsample | Enum;
  /**
   * Select encoder to use.
   */
  encoder?: ForeignHeifEncoder | Enum;
  /**
   * Which metadata to retain.
   */
  keep?: ForeignKeep | Flag;
  /**
   * Background value.
   */
  background?: ArrayConstant;
  /**
   * Set page height for multipage save.
   */
  page_height?: number;
  /**
   * Filename of icc profile to embed.
   */
  profile?: string;
}

export interface ThumbnailOptions {
  /**
   * Options that are passed on to the underlying loader.
   */
  option_string?: string;
  /**
   * Size to this height.
   */
  height?: number;
  /**
   * Whether to upsize, downsize, both up and
   * downsize, or force a size (breaks aspect ratio).
   */
  size?: "both" | "up" | "down" | "force";
  /**
   * Don't use orientation tags to rotate image upright.
   */
  no_rotate?: boolean;
  /**
   * Reduce to fill target rectangle, then crop.
   */
  crop?: Interesting;
  /**
   * Reduce in linear light.
   */
  linear?: boolean;
  /**
   * Fallback import profile.
   */
  import_profile?: string;
  /**
   * Fallback export profile.
   */
  export_profile?: string;
  /**
   * Rendering intent.
   */
  intent?: Intent;
  /**
   * Error level to fail on.
   */
  fail_on?: FailOn;
}

export type ImageQueueItem = {
  id: ItemId;
  file: File;
};

export type ConvertInput = {
  id: ItemId;
  file: File;
  outputType: ImageFormat;
  quality: number;
  interlaced: boolean;
};

export type ConvertQueueItem = ConvertInput & {
  fileName: string;
};

export type WorkerResult = {
  id: ItemId;
  result: ArrayBuffer;
  outputType: ImageFormat;
  status: "ok" | "error";
  error?: string;
};

export type ResultItem = WorkerResult & {
  fileName: string;
};

export const accept = "image/*,image/heif,image/heic,application/pdf";
