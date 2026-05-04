import { locallyStoreMap, loadMapFromLocalStorage } from '../dictLocalStorage/localStorageUtils';
import { convertMapping } from '../common/utility';
import { objectToMap } from '../common/utils';

export type References = Map<number, string>;
export type ReferencesObject = { [key: number]: string };

const aggregatedReferencesSeparator = ';';

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

export function aggregateAndGetValue(numericIDs: number[]): string {
  const values = new Set<string>();
  for (const numericID of numericIDs) {
    const value = references.get(numericID);
    if (value !== undefined && value !== '') {
      values.add(value);
    }
  }
  const aggregatedValue = Array.from(values).sort().join(aggregatedReferencesSeparator);
  for (const numericID of numericIDs) {
    references.set(numericID, aggregatedValue);
  }
  return aggregatedValue;
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
