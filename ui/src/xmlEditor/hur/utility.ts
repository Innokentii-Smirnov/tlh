import { isValid, normalize, isValidForm } from './morphologicalAnalysisValidator';
import segmenter from './segmentation/segmenter';
import { readMorphologicalAnalysis } from '../../model/morphologicalAnalysis';

export function convertDictionary(dictionary: Map<string, Set<string>>): { [key: string]: string[] } {
  const object: { [key: string]: string[] } = {};
  for (const [key, value] of dictionary) {
    object[key] = Array.from(value);
  }
  return object;
}

export function updateGlossesLexicon(dictionary: Map<string, Set<string>>, object: { [key: string]: string[] }): void {
  for (const [key, values] of Object.entries(object)) {
    if (isValidForm(key)) {
      const currSet = dictionary.get(key);
      if (currSet === undefined) {
        dictionary.set(key, new Set(values));
      }
      else {
        for (const value of values) {
          currSet.add(value);
        }
      }
    }
  }
}

export function updateAndValidateDictionary(dictionary: Map<string, Set<string>>, object: { [key: string]: string[] }): void {
  for (const [key, values] of Object.entries(object)) {
    const currSet = dictionary.get(key);
    if (currSet === undefined) {
      const newSet: Set<string> = new Set();
      for (const value of values) {
        if (isValid(value)) {
          const normalized = normalize(value, true);
          if (normalized !== null) {
            newSet.add(normalized);
            const ma = readMorphologicalAnalysis(1, normalized, []);
            if (ma !== undefined) {
              segmenter.add(key, ma);
            }
          }
        }
      }
      if (newSet.size > 0) {
        dictionary.set(key, newSet);
      }
    } else {
      for (const value of values) {
        if (isValid(value)) {
          const normalized = normalize(value, true);
          if (normalized !== null) {
            currSet.add(normalized);
            const ma = readMorphologicalAnalysis(1, normalized, []);
            if (ma !== undefined) {
              segmenter.add(key, ma);
            }
          }
        }
      }
    }
  }
  console.log(Array.from(segmenter.segmenters.keys()));
  for (const [key, basicSegmenter] of segmenter.segmenters) {
    console.log(key);
    for (const [chain, analyses] of basicSegmenter.suffixChains) {
      console.log(chain);
      console.log(analyses);
    }
  }
  for (const [key, basicSegmenter] of segmenter.segmenters) {
    console.log(key);
    for (const [chain, analyses] of basicSegmenter.stems) {
      console.log(chain);
      console.log(analyses);
    }
  }
}