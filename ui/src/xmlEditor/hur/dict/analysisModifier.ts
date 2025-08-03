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
