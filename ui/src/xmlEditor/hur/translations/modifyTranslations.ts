import { getKey, glosses } from '../glossProvider';

export function changeStem(oldStem: string, newStem: string, pos: string, translation: string): void {
  const oldKey = getKey(oldStem, pos);
  const newKey = getKey(newStem, pos);
  changeKey(oldKey, newKey, translation);
}

export function changePos(stem: string, oldPos: string, newPos: string, translation: string): void {
  const oldKey = getKey(stem, oldPos);
  const newKey = getKey(stem, newPos);
  changeKey(oldKey, newKey, translation);
}

function changeKey(oldKey: string, newKey: string, translation: string): void {
  let current = glosses.get(oldKey);
  if (current === undefined) {
    current = new Set<string>();
    current.add(translation);
  } else if (current.has(translation)) {
    glosses.delete(oldKey);
  }
  glosses.set(newKey, current);
}

export function changeTranslation(stem: string, pos: string, oldTranslation: string, newTranslation: string): void {
  const key = getKey(stem, pos);
  let current = glosses.get(key);
  if (current === undefined) {
    current = new Set<string>();
    glosses.set(key, current);
  } else {
    current.delete(oldTranslation);
  }
  current.add(newTranslation);
}
