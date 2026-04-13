import { locallyStoreMap, loadMapFromLocalStorage } from '../dictLocalStorage/localStorageUtils';
import { convertMapping } from '../common/utility';
import { objectToMap } from '../common/utils';

const fieldSeparator = ' @ ';
export function getReferenceKey(stem: string, pos: string, germanTranslation: string): string {
  return [stem, pos, germanTranslation].join(fieldSeparator);
}

export type References = Map<string, string>;
export type ReferencesObject = { [key: string]: string };

const localStorageKey = 'references';
let references: References;
try {
  references = loadMapFromLocalStorage(localStorageKey);
} catch(SyntaxError) {
  console.log('The English translations could not be loaded from the local storage.');
  references = new Map();
}
function locallyStoreReferences() {
  locallyStoreMap(references, localStorageKey);
}

// Accessors for the dictionary editor

export function getGlobalReferences(): References {
  return references;
}

export function setGlobalReferences(newReferences: References): void {
  references = newReferences;
  locallyStoreReferences();
}

// Accessors for saving and loading JSON files

export function getReferences(): ReferencesObject {
  return convertMapping(references);
}

export function setReferences(newReferences: ReferencesObject): void {
  references = objectToMap(newReferences);
  locallyStoreReferences();
}
