import {dictionary} from '../dictionary';
import {MorphologicalAnalysis, readMorphologicalAnalysis, writeMorphAnalysisValue} from
'../../../model/morphologicalAnalysis';

export function modifyAnalysis(transcriptions: string[], analysis: string,
  modification: (morphologicalAnalysis: MorphologicalAnalysis) => MorphologicalAnalysis): void {
  const morphologicalAnalysis = readMorphologicalAnalysis(1, analysis, []);
  if (morphologicalAnalysis !== undefined)
  {
    const newMorphologicalAnalysis = modification(morphologicalAnalysis);
    const newMorphologicalAnalysisValue = writeMorphAnalysisValue(newMorphologicalAnalysis);
    for (const transcription of transcriptions) {
      const analyses = dictionary.get(transcription);
      if (analyses !== undefined) {
        analyses.delete(analysis);
        analyses.add(newMorphologicalAnalysisValue);
      }
    }
  }
}
