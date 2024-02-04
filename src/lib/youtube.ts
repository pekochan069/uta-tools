export function checkUrl(url: string): boolean {
  const regex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/gi;

  return regex.test(url);
}

export function getVideoId(url: string): string {
  const regex =
    /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
  const res = regex.exec(url);

  return res ? res[3] : "";
}
