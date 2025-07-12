import { MorphologicalAnalysis, readMorphologicalAnalysis } from '../../../model/morphologicalAnalysis';

export function readMorphAnalysisValue(value: string): MorphologicalAnalysis | undefined {
  return readMorphologicalAnalysis(1, value, []);
}
