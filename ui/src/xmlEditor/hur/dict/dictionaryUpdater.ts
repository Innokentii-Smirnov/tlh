import { basicUpdateHurrianDictionary } from '../dict/dictionary';
import { readMorphAnalysisValue } from '../morphologicalAnalysis/auxiliary';
import { basicSaveGloss } from '../translations/glossUpdater';

export function addMorphologicalAnalysis(transcription: string, analysis: string) {
  basicUpdateHurrianDictionary(transcription, analysis);
  const morphologicalAnalysis = readMorphAnalysisValue(analysis);
  if (morphologicalAnalysis !== undefined) {
    basicSaveGloss(morphologicalAnalysis);
  }
}
