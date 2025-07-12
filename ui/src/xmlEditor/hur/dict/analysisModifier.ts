import {Dictionary, SetDictionary} from '../dictionary';
import {MorphologicalAnalysis, readMorphologicalAnalysis, writeMorphAnalysisValue} from
'../../../model/morphologicalAnalysis';
import update, {Spec} from 'immutability-helper';

export function modifyAnalysis(transcriptions: string[], analysis: string,
  modification: (morphologicalAnalysis: MorphologicalAnalysis) => MorphologicalAnalysis,
  setDictionary: SetDictionary):
  MorphologicalAnalysis | undefined {
  const morphologicalAnalysis = readMorphologicalAnalysis(1, analysis, []);
  if (morphologicalAnalysis !== undefined) {
    const newMorphologicalAnalysis = modification(morphologicalAnalysis);
    const newMorphologicalAnalysisValue = writeMorphAnalysisValue(newMorphologicalAnalysis);
    const spec: Spec<Dictionary> = {};
    for (const transcription of transcriptions) {
      spec[transcription] = {$remove: [analysis], $add: [newMorphologicalAnalysisValue]};
    }
    setDictionary(dictionary => update(dictionary, spec));
    return newMorphologicalAnalysis;
  }
}
