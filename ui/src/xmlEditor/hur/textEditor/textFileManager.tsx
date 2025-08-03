import { makeDownload } from '../../../downloadHelper';

export function downloadText(fileText: string, fileName: string): void {
  makeDownload(fileText, fileName);
}

export async function readText(file: File): Promise<string> {
  const fileText = await file.text();
  return fileText;
}
