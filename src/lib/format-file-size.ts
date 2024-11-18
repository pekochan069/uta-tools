const UNITS = ["B", "KB", "MB"];

export function formatFileSize(bytes: number): string {
  let unit = 0;
  while (bytes >= 1024 && unit < UNITS.length - 1) {
    bytes /= 1024;
    unit++;
  }
  return `${bytes.toFixed(2)} ${UNITS[unit]}`;
}
