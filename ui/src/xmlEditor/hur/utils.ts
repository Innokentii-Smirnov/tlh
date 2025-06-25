export function add<TKey, TValue>(map: Map<TKey, Set<TValue>>, key: TKey, value: TValue) {
  let current = map.get(key);
  if (current === undefined) {
    current = new Set<TValue>;
    map.set(key, current);
  }
  current.add(value);
}