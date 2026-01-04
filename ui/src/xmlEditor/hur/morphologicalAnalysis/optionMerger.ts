import { MultiMorphologicalAnalysisWithoutEnclitics } from '../../../model/morphologicalAnalysis';
import { SelectableLetteredAnalysisOption } from '../../../model/analysisOptions';
import update from 'immutability-helper';

export default function mergeIdenticalOptions(ma: MultiMorphologicalAnalysisWithoutEnclitics): MultiMorphologicalAnalysisWithoutEnclitics {
  const { analysisOptions } = ma;
  const newOptions: SelectableLetteredAnalysisOption[] = [];
  for (const option of analysisOptions) {
    if (!newOptions.some(prevOption => prevOption.analysis === option.analysis)) {
      newOptions.push(option);
    }
  }
  return update(ma, { analysisOptions: { $set: newOptions } });
}
