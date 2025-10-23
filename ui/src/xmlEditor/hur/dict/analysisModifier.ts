import {Dictionary} from './dictionary';
import {MorphologicalAnalysis, writeMorphAnalysisValue} from '../../../model/morphologicalAnalysis';
import update, {Spec} from 'immutability-helper';

export function modifyAnalysis(dictionary: Dictionary, transcriptions: string[],
  oldAnalysis: string, newMorphologicalAnalysis: MorphologicalAnalysis): Dictionary {
  const newMorphologicalAnalysisValue = writeMorphAnalysisValue(newMorphologicalAnalysis);
  const spec: Spec<Dictionary> = {};
  for (const transcription of transcriptions) {
    spec[transcription] = {$remove: [oldAnalysis], $add: [newMorphologicalAnalysisValue]};
  }
  return update(dictionary, spec);
}

export function addAnalysis(dictionary: Dictionary, transcription: string,
                            analysis: string): Dictionary {
  let spec: Spec<Dictionary>;
  if (dictionary.has(transcription)) {
    spec = {[transcription]: {$add: [analysis]}};
  } else {
    const values = new Set<string>();
    values.add(analysis);
    spec = {$add: [[transcription, values]]};
  }
  return update(dictionary, spec);
}

export function removeAnalysis(dictionary: Dictionary, transcription: string,
                               analysis: string): Dictionary {
  let spec: Spec<Dictionary>;
  if (dictionary.has(transcription)) {
    spec = {[transcription]: {$remove: [analysis]}};
    return update(dictionary, spec);
  } else {
    return dictionary;
  }
}
