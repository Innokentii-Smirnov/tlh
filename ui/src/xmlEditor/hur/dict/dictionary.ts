import { XmlElementNode } from 'simple_xml';
import { getText, getMrps } from '../common/xmlUtilities';
import { makeBoundTranscription } from '../transduction/transcribe';
import { makeStandardAnalyses } from '../transduction/standardAnalysis';
import { setGlosses, saveGloss } from '../translations/glossUpdater';
import { MorphologicalAnalysis, writeMorphAnalysisValue, readMorphologicalAnalysis }
  from '../../../model/morphologicalAnalysis';
import { convertDictionary, updateAndValidateDictionary } from '../common/utility';
import { isValid, normalize } from './morphologicalAnalysisValidator';
import segmenter from '../segmentation/segmenter';
import { readMorphAnalysisValue } from '../morphologicalAnalysis/auxiliary';
import { inConcordance } from '../concordance/concordance';
import { upgradeGlosses } from '../translations/glossProvider';
import { objectToSetValuedMap } from '../common/utils';

export type Dictionary = Map<string, Set<string>>;

export type ModifyDictionary = (dictionary: Dictionary) => Dictionary;

export type SetDictionary = (modifyDictionary: ModifyDictionary) => void;

export let dictionary: Dictionary = new Map();

fetch('PrecompiledDictionary.json')
  .then(response => response.json())
  .then(json => {
    dictionary = objectToSetValuedMap(json.dictionary);
    const {glosses} = json;
    upgradeGlosses(glosses);
  });

export function setGlobalDictionary(newDictionary: Dictionary): void {
  dictionary = newDictionary;
}

export function getGlobalDictionary(): Dictionary {
  return dictionary;
}

export function containsAnalysis(dictionary: Dictionary, analysis: string): boolean {
  return Array.from(dictionary.values()).some(analyses => analyses.has(analysis));
}

export function annotateHurrianWord(node: XmlElementNode): void {
  const transliteration: string = getText(node);
  const transcription: string = makeBoundTranscription(transliteration);

  node.attributes.trans = transcription;
  if (node.attributes.mrp0sel === 'HURR') {
    node.attributes.mrp0sel = '';
  }

  if (dictionary.has(transcription)) {
    setGlosses(node);
    const possibilities: Set<string> | undefined = dictionary.get(transcription);
    if (possibilities === undefined) {
      throw new Error();
    }
    if (node.attributes.firstAnalysisIsPlaceholder === 'true') {
      delete node.attributes.mrp1;
      delete node.attributes.firstAnalysisIsPlaceholder;
    }
    const mrps: Map<string, string> = getMrps(node);
    if (mrps.size === 0) {
      let i = 1;
      for (const analysis of possibilities) {
        node.attributes['mrp' + i.toString()] = analysis;
        i++;
      }
    }
  } else {
    const mrps: Map<string, string> = getMrps(node);
    if (mrps.size === 0) {
      const results: MorphologicalAnalysis[] = segmenter.segment(transcription);
      if (results.length > 0) {
        let i = 1;
        for (const ma of results) {
          node.attributes['mrp' + i.toString()] = writeMorphAnalysisValue(ma);
          i++;
        }
      } else {
        const analyses: MorphologicalAnalysis[] = makeStandardAnalyses(transcription);
        if (analyses.length > 0) {
          for (const ma of analyses) {
            node.attributes['mrp' + ma.number.toString()]
            = writeMorphAnalysisValue(ma);
          }
        }
        else {
          node.attributes.mrp1 = transcription + '@@@@';
          node.attributes.firstAnalysisIsPlaceholder = 'true';
        }
      }
      setGlosses(node);
    }
  }
}

export function updateHurrianDictionary(
  node: XmlElementNode, number: number, value: string
): void {
  if (number === 1) {
    delete node.attributes.firstAnalysisIsPlaceholder;
  }
  const transcription: string = node.attributes.trans || '';
  basicUpdateHurrianDictionary(transcription, value);
  saveGloss(number, value);
}

export function basicUpdateHurrianDictionary(
  transcription: string, value: string
): void {
  if (!isValid(value)) {
    return;
  }
  const normalized = normalize(value, true, false);
  if (normalized !== null) {
    let possibilities: Set<string> | undefined;
    if (dictionary.has(transcription)) {
      possibilities = dictionary.get(transcription);
    }
    else {
      possibilities = new Set<string>();
      dictionary.set(transcription, possibilities);
    }
    if (possibilities === undefined) {
      throw new Error();
    }
    possibilities.add(normalized);
    const ma = readMorphologicalAnalysis(1, normalized, []);
    if (ma !== undefined) {
      segmenter.add(transcription, ma);
    }
  }
}

export function deleteAnalysisFromHurrianDictionary(transcription: string, analysis: string) {
  const possibilities = dictionary.get(transcription);
  if (possibilities !== undefined) {
    possibilities.delete(analysis);
  }
}

export function getDictionary(): { [key: string]: string[] } {
  return convertDictionary(dictionary);
}

export function upgradeDictionary(object: { [key: string]: string[] }): void {
  updateAndValidateDictionary(dictionary, object);
}

export function cleanUpDictionary(): void {
  for (const analyses of dictionary.values()) {
    for (const analysis of analyses) {
      const ma = readMorphAnalysisValue(analysis);
      if (ma !== undefined) {
        if (!inConcordance(ma)) {
          analyses.delete(analysis);
        }
      }
    }
  }
}
