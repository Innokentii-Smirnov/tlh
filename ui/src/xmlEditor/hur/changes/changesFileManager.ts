import { getChanges, getSources, updateChanges, updateSources } from './changesAccumulator';
import { convertMapping, convertDictionary } from '../common/utility';
import { makeDownload } from '../../../downloadHelper';

export function downloadChanges(): void {
  const changes = convertMapping(getChanges());
  const sources = convertDictionary(getSources());
  const obj = {changes, sources};
  const jsonText = JSON.stringify(obj, undefined, '\t');
  makeDownload(jsonText, 'Changes.json');
}

export async function readChanges(file: File) {
  const source = await file.text();
  const parsed = JSON.parse(source);
  const {changes, sources} = parsed;
  updateChanges(changes);
  updateSources(sources);
}
