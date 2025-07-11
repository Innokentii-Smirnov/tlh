import { dictionary } from '../dictionary';

export function countValues(): number {
  let count = 0;
  for (const analyses of dictionary.values()) {
    count += analyses.size;
  }
  return count;
}
