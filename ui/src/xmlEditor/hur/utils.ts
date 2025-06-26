export function add<TKey, TValue>(map: Map<TKey, Set<TValue>>, key: TKey, value: TValue) {
  let current = map.get(key);
  if (current === undefined) {
    current = new Set<TValue>;
    map.set(key, current);
  }
  current.add(value);
}

export function removeMacron(s: string) {
  return s
    .replaceAll('ā', 'a')
    .replaceAll('ē', 'e')
    .replaceAll('ī', 'i')
    .replaceAll('ō', 'o')
    .replaceAll('ū', 'u');
}