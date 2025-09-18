import { getKey, glosses, splitTranslationIntoWords } from './glossProvider';
import { postJSON } from '../common/utils';
import { replaceStemUrl, replacePosUrl, replaceTranslationUrl } from '../../../urls';

export function changeStem(oldStem: string, newStem: string, pos: string, translation: string): void {
  const oldKey = getKey(oldStem, pos);
  const newKey = getKey(newStem, pos);
  changeKey(oldKey, newKey, translation);
  postJSON(replaceStemUrl, {oldStem, newStem, pos, translation});
}

export function changePos(stem: string, oldPos: string, newPos: string, translation: string): void {
  const oldKey = getKey(stem, oldPos);
  const newKey = getKey(stem, newPos);
  changeKey(oldKey, newKey, translation);
  postJSON(replacePosUrl, {stem, oldPos, newPos, translation});
}

function changeKey(oldKey: string, newKey: string, translation: string): void {
  const translationWords = splitTranslationIntoWords(translation);
  const oldTranslationWordSet = glosses.get(oldKey);
  const newTranslationWordSet = new Set<string>();
  if (oldTranslationWordSet !== undefined) {
    for (const translationWord of translationWords) {
      oldTranslationWordSet.delete(translationWord);
    }
    if (oldTranslationWordSet.size === 0) {
      glosses.delete(oldKey);
    }
  }
  for (const translationWord of translationWords) {
    newTranslationWordSet.add(translationWord);
  }
  if (!(newTranslationWordSet.size === 0)) {
    glosses.set(newKey, newTranslationWordSet);
  }
}

export function changeTranslation(stem: string, pos: string, oldTranslation: string, newTranslation: string): void {
  const key = getKey(stem, pos);
  let current = glosses.get(key);
  if (current === undefined) {
    current = new Set<string>();
    glosses.set(key, current);
  } else {
    const oldTranslationWords = splitTranslationIntoWords(oldTranslation);
    for (const oldTranslationWord of oldTranslationWords) {
      current.delete(oldTranslationWord);
    }
  }
  const newTranslationWords = splitTranslationIntoWords(newTranslation);
  for (const newTranslationWord of newTranslationWords) {
    current.add(newTranslationWord);
  }
  postJSON(replaceTranslationUrl, {stem, pos, oldTranslation, newTranslation});
}
