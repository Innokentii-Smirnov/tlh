import { getChanges, setChanges } from './changesAccumulator';
import { makeDownload } from '../../../downloadHelper';

export function downloadChanges(): void {
  const changes = getChanges();
  const lines: string[] = [];
  for (const [source, target] of changes) {
    lines.push(source + '\t' + target + '\n');
  }
  const tsvText = lines.join('');
  makeDownload(tsvText, 'Changes.tsv');
}

const lb = /\r\n|\r|\n/;

export async function readChanges(file: File) {
  const fileText = await file.text();
  const changes = new Map<string, string>();
  const lines = fileText.split(lb).filter(line => line !== '');
  for (const line of lines) {
    const [source, target] = line.split('\t');
    changes.set(source, target);
  }
  setChanges(changes);
}
