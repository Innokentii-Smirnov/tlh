import { getChanges } from './changesAccumulator';
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
