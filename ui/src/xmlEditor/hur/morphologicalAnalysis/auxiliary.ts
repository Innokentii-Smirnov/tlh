import { MorphologicalAnalysis, readMorphologicalAnalysis } from '../../../model/morphologicalAnalysis';

export function readMorphAnalysisValue(value: string): MorphologicalAnalysis | undefined {
  return readMorphologicalAnalysis(1, value, []);
}

export function isSelected(morphologicalAnalysis: MorphologicalAnalysis): boolean {
  switch (morphologicalAnalysis._type) {
    case 'SingleMorphAnalysisWithoutEnclitics':
      return morphologicalAnalysis.selected;
    case 'MultiMorphAnalysisWithoutEnclitics':
      return morphologicalAnalysis.analysisOptions.some(analysisOption => analysisOption.selected);
    default:
      return false;
  }
}

export function getFirstSelectedMorphTag(morphologicalAnalysis: MorphologicalAnalysis):
  string | undefined {
  switch (morphologicalAnalysis._type) {
    case 'SingleMorphAnalysisWithoutEnclitics': {
      return morphologicalAnalysis.analysis;
    }
    case 'MultiMorphAnalysisWithoutEnclitics': {
      const analysisOption = morphologicalAnalysis
        .analysisOptions
        .find(analysisOption => analysisOption.selected);
      if (analysisOption !== undefined) {
        return analysisOption.analysis;
      } else {
        return undefined;
      }
    }
    default:
      return undefined;
  }
}
