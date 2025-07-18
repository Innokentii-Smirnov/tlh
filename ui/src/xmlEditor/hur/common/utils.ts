import { SelectableLetteredAnalysisOption } from '../../../model/analysisOptions';
import { MorphologicalAnalysis } from '../../../model/morphologicalAnalysis';

function getValueSet<TKey, TValue>(map: Map<TKey, Set<TValue>>, key: TKey): Set<TValue> {
  let current = map.get(key);
  if (current === undefined) {
    current = new Set<TValue>;
    map.set(key, current);
  }
  return current;
}

export function add<TKey, TValue>(map: Map<TKey, Set<TValue>>, key: TKey, value: TValue) {
  const current = getValueSet(map, key);
  current.add(value);
}

export function remove<TKey, TValue>(map: Map<TKey, Set<TValue>>, key: TKey, value: TValue) {
  const current = map.get(key);
  if (current !== undefined) {
    current.delete(value);
  }
}

export function addMultiple<TKey, TValue>(map: Map<TKey, Set<TValue>>, key: TKey, values: TValue[]) {
  const current = getValueSet(map, key);
  for (const value of values) {
    current.add(value);
  }
}

export function removeMacron(s: string) {
  return s
    .replaceAll('ā', 'a')
    .replaceAll('ē', 'e')
    .replaceAll('ī', 'i')
    .replaceAll('ō', 'o')
    .replaceAll('ū', 'u');
}

export function formIsFragment(form: string): boolean {
  return form.includes('[') || form.includes(']') || form.includes('x');
}

export function makeAnalysisOptions(morphTags: string[]): SelectableLetteredAnalysisOption[] {
  const analysisOptions: SelectableLetteredAnalysisOption[] = [];
  let c = 97; // Code von 'a'
  for (const morphTag of morphTags) {
    const analysisOption: SelectableLetteredAnalysisOption =
    {
      letter: String.fromCodePoint(c),
      analysis: morphTag,
      selected: false
    };
    c++;
    analysisOptions.push(analysisOption);
  }
  return analysisOptions;
}

export function groupBy<TSource, TKey, TValue>(array: TSource[], getKey: (elem: TSource) => TKey, getValue: (elem: TSource) => TValue): Map<TKey, Set<TValue>> {
  const map = new Map<TKey, Set<TValue>>();
  for (const element of array) {
    const key = getKey(element);
    const value = getValue(element);
    add(map, key, value);
  }
  return map;
}

export function getMorphTags(analysis: MorphologicalAnalysis): string[] | null {
  switch (analysis._type) {
    case 'SingleMorphAnalysisWithoutEnclitics':
      return [analysis.analysis];
    case 'MultiMorphAnalysisWithoutEnclitics':
      return analysis.analysisOptions.map(({analysis}) => analysis);
    default:
      return null;
  }
}
