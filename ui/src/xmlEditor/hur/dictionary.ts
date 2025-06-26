import { XmlElementNode } from 'simple_xml';
import { getText, getMrps } from './xmlUtilities';
import { makeBoundTranscription } from './transcribe';
import { makeStandardAnalyses } from './standardAnalysis';
import { setGlosses, saveGloss } from './glossUpdater';
import { MorphologicalAnalysis, writeMorphAnalysisValue }
  from '../../model/morphologicalAnalysis';
import { convertDictionary, updateAndValidateDictionary } from './utility';
import { isValid, normalize } from './morphologicalAnalysisValidator';
import segmenter from './segmentation/segmenter';

const dictionary: Map<string, Set<string>> = new Map();

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
      const results = segmenter.segment(transcription);
      if (results.length > 0) {
        let i = 1;
        for (const result of results) {
          const analysis = result.toString();
          node.attributes['mrp' + i.toString()] = analysis;
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
  const normalized = normalize(value, false);
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
    segmenter.add(transcription, normalized);
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
