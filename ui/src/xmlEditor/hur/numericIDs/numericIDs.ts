import { locallyStoreSetValuedMap, loadSetValuedMapFromLocalStorage } from '../dictLocalStorage/localStorageUtils';
import { convertDictionary } from '../common/utility';
import { objectToSetValuedMap } from '../common/utils';

const fieldSeparator = ' @ ';
export function getNumericIDKey(stem: string, pos: string, germanTranslation: string): string {
  return [stem, pos, germanTranslation].join(fieldSeparator);
}

export function getNumericIDsByKey(numericIDs: NumericIDs, numericIDKey: string): Set<number> {
  const currentNumericIDs = numericIDs.get(numericIDKey);
  if (currentNumericIDs === undefined || currentNumericIDs.size === 0) {
    return generateNewNumericID(numericIDKey);
  } else {
    return currentNumericIDs;
  }
}

export type NumericIDs = Map<string, Set<number>>;
export type NumericIDsObject = { [key: string]: number[] };

const localStorageKey = 'numericIDs';
let numericIDs: NumericIDs;
try {
  numericIDs = loadSetValuedMapFromLocalStorage(localStorageKey);
} catch(SyntaxError) {
  console.log('The English translations could not be loaded from the local storage.');
  numericIDs = new Map();
}
function locallyStoreNumericIDs() {
  locallyStoreSetValuedMap(numericIDs, localStorageKey);
}

// Accessors for the dictionary editor

export function getGlobalNumericIDs(): NumericIDs {
  return numericIDs;
}

export function setGlobalNumericIDs(newNumericIDs: NumericIDs): void {
  numericIDs = newNumericIDs;
  locallyStoreNumericIDs();
}

// Accessors for saving and loading JSON files

export function getNumericIDs(): NumericIDsObject {
  return convertDictionary(numericIDs);
}

export function setNumericIDs(newNumericIDs: NumericIDsObject): void {
  numericIDs = objectToSetValuedMap(newNumericIDs);
  locallyStoreNumericIDs();
}

export function generateNewNumericID(key: string): Set<number> {
  const existingIDs: number[] = Array.from(numericIDs.values())
    .map((value: Set<number>) => Array.from(value)).flat();
  const maximalExistingID = existingIDs.reduce((a: number, b: number) => Math.max(a, b), 0);
  const newID = maximalExistingID + 1;
  const newIDs = new Set<number>();
  newIDs.add(newID);
  numericIDs.set(key, newIDs);
  locallyStoreNumericIDs();
  return newIDs;
}
